import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL + '/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// attach access token automatically
api.interceptors.request.use((config) => {
  const access = localStorage.getItem('access');
  if (access) config.headers['Authorization'] = `Bearer ${access}`;
  return config;
});

// response interceptor to handle 401 -> try refresh once
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  })
  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // try to refresh
      if (isRefreshing) {
        // queue the request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refresh = localStorage.getItem('refresh');
      if (!refresh) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const resp = await axios.post(`${API_URL}/api/auth/refresh/`, { refresh });
        const newAccess = resp.data.access;
        localStorage.setItem('access', newAccess);
        api.defaults.headers['Authorization'] = 'Bearer ' + newAccess;
        processQueue(null, newAccess);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // logout if refresh failed
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        isRefreshing = false;
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
