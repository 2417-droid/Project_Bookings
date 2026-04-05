import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MovieAPI } from '../api';

export default function MoviesPage() {
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [langFilter, setLangFilter] = useState('');
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const movies = await MovieAPI.getAll();
      setAllMovies(movies);
      setFilteredMovies(movies);
      
      // Extract genres and languages
      const uniqueGenres = [...new Set(movies.map(m => m.genre).filter(Boolean))];
      const uniqueLangs = [...new Set(movies.map(m => m.language).filter(Boolean))];
      setGenres(uniqueGenres);
      setLanguages(uniqueLangs);
    } catch (e) {
      console.error('Failed to load movies:', e);
    } finally {
      setLoading(false);
    }
  };

  const filterMovies = () => {
    let filtered = allMovies;
    if (search) {
      filtered = filtered.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (genreFilter) {
      filtered = filtered.filter(m => m.genre === genreFilter);
    }
    if (langFilter) {
      filtered = filtered.filter(m => m.language === langFilter);
    }
    setFilteredMovies(filtered);
  };

  useEffect(() => {
    filterMovies();
  }, [search, genreFilter, langFilter]);

  return (
    <div className="container">
      <h2 className="section-title">All Movies</h2>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '0.7rem 1rem',
            borderRadius: '8px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            background: 'var(--bg-card)',
            color: 'var(--text)',
            fontSize: '0.95rem',
            outline: 'none'
          }}
        />
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          style={{
            padding: '0.7rem 1rem',
            borderRadius: '8px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            background: 'var(--bg-card)',
            color: 'var(--text)',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        >
          <option value="">All Genres</option>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select
          value={langFilter}
          onChange={(e) => setLangFilter(e.target.value)}
          style={{
            padding: '0.7rem 1rem',
            borderRadius: '8px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            background: 'var(--bg-card)',
            color: 'var(--text)',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        >
          <option value="">All Languages</option>
          {languages.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="grid grid-4">
        {loading ? (
          <p>Loading movies...</p>
        ) : filteredMovies.length === 0 ? (
          <p>No movies found</p>
        ) : (
          filteredMovies.map(m => (
            <div key={m.id} className="card">
              <div className="card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', background: 'linear-gradient(135deg, var(--bg-night), var(--bg-card))' }}>
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
          ))
        )}
      </div>
    </div>
  );
}
