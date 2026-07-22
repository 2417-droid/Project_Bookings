import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './style.css';
import MoviesPage from './pages/MoviesPage';
import TheatresPage from './pages/TheatresPage';
import BookingsPage from './pages/BookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import MovieDetailPage from './pages/MovieDetailPage';
import { MovieAPI } from './api';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Vibe<span>Check</span></Link>
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
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-sm" style={{ marginRight: '0.5rem' }}>Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (storedUser) setUser(storedUser);
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={logout} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
        <Route path="/theatres" element={<TheatresPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={(userData) => setUser(userData)} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MovieAPI.getAll()
      .then(data => setMovies(data))
      .catch(err => console.error('Failed to load movies for homepage:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero hero-home" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1>Your <span>Entertainment</span> Starts Here</h1>
        <p>Book movie tickets for the latest shows in your city</p>
        <Link to="/movies" className="btn btn-primary">Browse Movies</Link>
      </section>

      <div className="container" style={{ marginTop: '2rem' }}>
        <h2 className="section-title">Now Showing</h2>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading movies...</p>
        ) : movies.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No movies available right now.</p>
        ) : (
          <div className="grid grid-4">
            {movies.map(m => (
              <div key={m.id} className="card">
                <div className="card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--bg-night), var(--bg-card))' }}>
                  <img 
                    src={m.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'} 
                    alt={m.title} 
                    style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '4px' }} 
                  />
                </div>
                <div className="card-body">
                  <h3>{m.title}</h3>
                  <p>{m.description || ''}</p>
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {m.genre && <span className="badge badge-genre">{m.genre}</span>}
                    {m.language && <span className="badge badge-lang">{m.language}</span>}
                    {m.rating && <span className="badge badge-rating">⭐ {m.rating}</span>}
                  </div>
                </div>
                <div className="card-footer">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.durationMinutes ? m.durationMinutes + ' min' : ''}</span>
                  <Link to={`/movies/${m.id}`} className="btn btn-sm btn-primary">Book Now</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App
