import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './style.css';
import { CityAPI } from './api';
import MoviesPage from './pages/MoviesPage';
import TheatresPage from './pages/TheatresPage';
import BookingsPage from './pages/BookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import MovieDetailPage from './pages/MovieDetailPage';

function App() {
  const [cities, setCities] = useState([]);
  const [activeCity, setActiveCity] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (storedUser) setUser(storedUser);

    const loadCities = async () => {
      try {
        const result = await CityAPI.getAll();
        setCities(result);
        if (result.length > 0) setActiveCity(result[0].name);
      } catch (error) {
        console.error('City load failed', error);
      }
    };

    loadCities();
  }, []);

  const handleCitySelect = (cityName) => {
    setActiveCity(cityName);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="logo">Book<span>My</span>Show</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/movies">Movies</Link>
          <Link to="/theatres">Theatres</Link>
          <Link to="/bookings">My Bookings</Link>
          <Link to="/admin">Admin</Link>
        </div>
        <div className="nav-user" id="nav-user">
          {user ? (
            <>
              <span style={{ marginRight: '1rem' }}>Hi, {user.name}</span>
              <button className="btn btn-secondary btn-sm" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ marginRight: '0.5rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </nav>

      <div className="city-bar" id="city-bar">
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>📍 City:</span>
        {cities.map((city, index) => (
          <button
            key={city.id}
            className={`city-chip${activeCity === city.name ? ' active' : ''}`}
            onClick={() => handleCitySelect(city.name)}
          >
            {city.name}
          </button>
        ))}
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
        <Route path="/theatres" element={<TheatresPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

function HomePage() {
  return (
    <section className="hero" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1>Your <span>Entertainment</span> Starts Here</h1>
      <p>Book movie tickets for the latest shows in your city</p>
      <Link to="/movies" className="btn btn-primary">Browse Movies</Link>
    </section>
  );
}

export default App
