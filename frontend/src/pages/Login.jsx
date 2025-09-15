import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (error) {
      setErr('Login failed — vérifie username/password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">Connexion</h1>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" className="w-full p-2 border mb-3 rounded" />
        <input value={password} type="password" onChange={e=>setPassword(e.target.value)} placeholder="password" className="w-full p-2 border mb-3 rounded" />
        <button className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
