import React, { useState, useEffect } from 'react';
import { CityAPI, MovieAPI, TheatreAPI, ScreenAPI, SeatAPI, ShowAPI } from '../api';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('cities');
  const [cities, setCities] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [shows, setShows] = useState([]);

  // Form states
  const [cityName, setCityName] = useState('');
  const [cityState, setCityState] = useState('');
  const [movieData, setMovieData] = useState({ title: '', genre: '', language: '', durationMinutes: '', rating: '', releaseDate: '', description: '' });
  const [theatreData, setTheatreData] = useState({ name: '', address: '', cityId: '' });
  const [screenData, setScreenData] = useState({ name: '', totalSeats: '', theatreId: '' });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [citiesData, moviesData, theatresData, screensData, showsData] = await Promise.all([
        CityAPI.getAll(),
        MovieAPI.getAll(),
        TheatreAPI.getAll(),
        ScreenAPI.getAll(),
        ShowAPI.getAll()
      ]);
      setCities(citiesData);
      setMovies(moviesData);
      setTheatres(theatresData);
      setScreens(screensData);
      setShows(showsData);
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  };

  // City management
  const addCity = async (e) => {
    e.preventDefault();
    if (!cityName) { alert('Please enter city name'); return; }
    try {
      await CityAPI.add({ name: cityName, state: cityState });
      alert('City added!');
      setCityName('');
      setCityState('');
      loadAllData();
    } catch (e) {
      alert('Error adding city');
    }
  };

  // Movie management
  const addMovie = async (e) => {
    e.preventDefault();
    if (!movieData.title) { alert('Please enter movie title'); return; }
    try {
      await MovieAPI.add({
        ...movieData,
        durationMinutes: movieData.durationMinutes ? parseInt(movieData.durationMinutes) : null,
        rating: movieData.rating ? parseFloat(movieData.rating) : null
      });
      alert('Movie added!');
      setMovieData({ title: '', genre: '', language: '', durationMinutes: '', rating: '', releaseDate: '', description: '' });
      loadAllData();
    } catch (e) {
      alert('Error adding movie');
    }
  };

  const deleteMovie = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await MovieAPI.delete(id);
      alert('Movie deleted');
      loadAllData();
    } catch (e) {
      alert('Error deleting movie');
    }
  };

  // Theatre management
  const addTheatre = async (e) => {
    e.preventDefault();
    if (!theatreData.name || !theatreData.cityId) { alert('Please fill all fields'); return; }
    try {
      await TheatreAPI.add({
        name: theatreData.name,
        address: theatreData.address,
        cityId: parseInt(theatreData.cityId)
      });
      alert('Theatre added!');
      setTheatreData({ name: '', address: '', cityId: '' });
      loadAllData();
    } catch (e) {
      alert('Error adding theatre');
    }
  };

  // Screen management
  const addScreen = async (e) => {
    e.preventDefault();
    if (!screenData.name || !screenData.totalSeats || !screenData.theatreId) { alert('Please fill all fields'); return; }
    try {
      await ScreenAPI.add({
        name: screenData.name,
        totalSeats: parseInt(screenData.totalSeats),
        theatreId: parseInt(screenData.theatreId)
      });
      alert('Screen added!');
      setScreenData({ name: '', totalSeats: '', theatreId: '' });
      loadAllData();
    } catch (e) {
      alert('Error adding screen');
    }
  };

  return (
    <div className="container">
      <h2 className="section-title">Admin Dashboard</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        {['cities', 'movies', 'theatres', 'screens', 'shows'].map(tab => (
          <button
            key={tab}
            className="tab"
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.8rem 1.5rem',
              background: activeTab === tab ? 'var(--primary)' : 'transparent',
              color: 'var(--text)',
              border: 'none',
              borderRadius: '4px 4px 0 0',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: activeTab === tab ? '700' : '400',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CITIES TAB */}
      {activeTab === 'cities' && (
        <div>
          <form onSubmit={addCity} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="City name"
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)'
              }}
            />
            <input
              type="text"
              value={cityState}
              onChange={(e) => setCityState(e.target.value)}
              placeholder="State"
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)'
              }}
            />
            <button type="submit" className="btn btn-primary">Add City</button>
          </form>

          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>State</th>
              </tr>
            </thead>
            <tbody>
              {cities.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td><td>{c.name}</td><td>{c.state || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MOVIES TAB */}
      {activeTab === 'movies' && (
        <div>
          <form onSubmit={addMovie} style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <input
              type="text"
              value={movieData.title}
              onChange={(e) => setMovieData({ ...movieData, title: e.target.value })}
              placeholder="Title"
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)'
              }}
            />
            <input
              type="text"
              value={movieData.genre}
              onChange={(e) => setMovieData({ ...movieData, genre: e.target.value })}
              placeholder="Genre"
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)'
              }}
            />
            <input
              type="text"
              value={movieData.language}
              onChange={(e) => setMovieData({ ...movieData, language: e.target.value })}
              placeholder="Language"
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)'
              }}
            />
            <input
              type="number"
              value={movieData.durationMinutes}
              onChange={(e) => setMovieData({ ...movieData, durationMinutes: e.target.value })}
              placeholder="Duration (min)"
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)'
              }}
            />
            <input
              type="number"
              value={movieData.rating}
              onChange={(e) => setMovieData({ ...movieData, rating: e.target.value })}
              placeholder="Rating"
              step="0.1"
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)'
              }}
            />
            <input
              type="date"
              value={movieData.releaseDate}
              onChange={(e) => setMovieData({ ...movieData, releaseDate: e.target.value })}
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)'
              }}
            />
            <textarea
              value={movieData.description}
              onChange={(e) => setMovieData({ ...movieData, description: e.target.value })}
              placeholder="Description"
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)',
                gridColumn: '1 / -1',
                minHeight: '80px'
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1' }}>Add Movie</button>
          </form>

          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Title</th><th>Genre</th><th>Language</th><th>Duration</th><th>Rating</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map(m => (
                <tr key={m.id}>
                  <td>{m.id}</td><td>{m.title}</td><td>{m.genre || ''}</td>
                  <td>{m.language || ''}</td><td>{m.durationMinutes || ''}</td><td>{m.rating || ''}</td>
                  <td><button className="btn btn-sm btn-danger" onClick={() => deleteMovie(m.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* THEATRES TAB */}
      {activeTab === 'theatres' && (
        <div>
          <form onSubmit={addTheatre} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={theatreData.name}
              onChange={(e) => setTheatreData({ ...theatreData, name: e.target.value })}
              placeholder="Theatre name"
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)'
              }}
            />
            <input
              type="text"
              value={theatreData.address}
              onChange={(e) => setTheatreData({ ...theatreData, address: e.target.value })}
              placeholder="Address"
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)'
              }}
            />
            <select
              value={theatreData.cityId}
              onChange={(e) => setTheatreData({ ...theatreData, cityId: e.target.value })}
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)'
              }}
            >
              <option value="">Select City</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button type="submit" className="btn btn-primary">Add Theatre</button>
          </form>

          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Address</th><th>City</th>
              </tr>
            </thead>
            <tbody>
              {theatres.map(t => (
                <tr key={t.id}>
                  <td>{t.id}</td><td>{t.name}</td><td>{t.address || ''}</td><td>{t.city?.name || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SCREENS TAB */}
      {activeTab === 'screens' && (
        <div>
          <form onSubmit={addScreen} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={screenData.name}
              onChange={(e) => setScreenData({ ...screenData, name: e.target.value })}
              placeholder="Screen name"
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)'
              }}
            />
            <input
              type="number"
              value={screenData.totalSeats}
              onChange={(e) => setScreenData({ ...screenData, totalSeats: e.target.value })}
              placeholder="Total seats"
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)'
              }}
            />
            <select
              value={screenData.theatreId}
              onChange={(e) => setScreenData({ ...screenData, theatreId: e.target.value })}
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)'
              }}
            >
              <option value="">Select Theatre</option>
              {theatres.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button type="submit" className="btn btn-primary">Add Screen</button>
          </form>

          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Seats</th><th>Theatre</th>
              </tr>
            </thead>
            <tbody>
              {screens.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td><td>{s.name}</td><td>{s.totalSeats || ''}</td><td>{s.theatre?.name || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SHOWS TAB */}
      {activeTab === 'shows' && (
        <div>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Movie</th><th>Screen</th><th>Date</th><th>Time</th><th>Price</th>
              </tr>
            </thead>
            <tbody>
              {shows.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td><td>{s.movie?.title || ''}</td><td>{s.screen?.name || ''}</td>
                  <td>{s.showDate || ''}</td><td>{s.startTime || ''}</td><td>₹{s.ticketPrice || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
