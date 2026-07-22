import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserAPI } from '../api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await UserAPI.register({ name, email, password, phone });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (e) {
      alert('Registration failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-layout">
      <div className="auth-split-image">
        <img src="/auth-bg.png" alt="Cinema Background" />
        <div className="auth-split-image-overlay">
          <h2>Join the Club.</h2>
          <p>Create an account to book tickets, save your favorite theaters, and unlock exclusive rewards.</p>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-glass-panel">
          <h2 className="auth-title">Register</h2>
          <p className="auth-subtitle">Create a new account</p>
          
          <form onSubmit={handleRegister}>
            <div className="auth-input-wrapper">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

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

            <div className="auth-input-wrapper">
              <label>Phone (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-btn"
            >
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
