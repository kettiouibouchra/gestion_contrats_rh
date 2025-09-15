import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  useEffect(() => {
    // optional: check token validity on load
  }, []);

  const login = async (username, password) => {
    const resp = await api.post('auth/login/', { username, password });
    const { access, refresh } = resp.data;
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);

    // get user profile (optionnel : /api/users/me/ si implémenté)
    const meResp = await api.get('users/me/').catch(()=>null);
    const userData = meResp?.data || { username };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const value = { user, login, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
