import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserAPI } from '../api';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const user = await UserAPI.login({ email, password });
      localStorage.setItem('user', JSON.stringify(user));
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
      alert('Login successful!');
      navigate('/');
    } catch (e) {
      console.error('Login error:', e.response?.data || e);
      const message = e.response?.data?.message || e.response?.data?.error || e.message || 'Unknown error';
      alert('Login failed: ' + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-layout">
      <div className="auth-split-image">
        <img src="/auth-bg.png" alt="Cinema Background" />
        <div className="auth-split-image-overlay">
          <h2>Welcome Back.</h2>
          <p>Book your favorite movies, manage your tickets, and experience the magic of cinema.</p>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-glass-panel">
          <h2 className="auth-title">Login</h2>
          <p className="auth-subtitle">Enter your credentials to access your account</p>
          
          <form onSubmit={handleLogin}>
            <div className="auth-input-wrapper">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="auth-input-wrapper">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-btn"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
