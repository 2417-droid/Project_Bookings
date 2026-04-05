import React, { useState, useEffect } from 'react';
import { TheatreAPI, CityAPI, ScreenAPI } from '../api';

export default function TheatresPage() {
  const [theatres, setTheatres] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [citiesData, theatresData] = await Promise.all([
        CityAPI.getAll(),
        TheatreAPI.getAll()
      ]);
      setCities(citiesData);
      setTheatres(theatresData);
    } catch (e) {
      console.error('Failed to load data:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadTheatresByCity = async (cityId) => {
    setLoading(true);
    try {
      if (cityId) {
        const data = await TheatreAPI.getByCity(cityId);
        setTheatres(data);
      } else {
        const data = await TheatreAPI.getAll();
        setTheatres(data);
      }
    } catch (e) {
      console.error('Failed to load theatres:', e);
    } finally {
      setLoading(false);
    }
  };

  const viewScreens = async (theatreId, theatreName) => {
    try {
      const screens = await ScreenAPI.getByTheatre(theatreId);

      if (screens.length === 0) {
        setToast({ type: 'info', message: `${theatreName}: No screens found.` });
        setTimeout(() => setToast(null), 3000);
        return;
      }

      const rows = screens
        .map((screen) => `• ${screen.name} (${screen.totalSeats || '?'} seats)`)
        .join('\n');

      setToast({
        type: 'info',
        message: `${theatreName} Screens:\n${rows}`
      });
      setTimeout(() => setToast(null), 6000);
    } catch (e) {
      setToast({ type: 'error', message: 'Could not load screens.' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="container">
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>{toast.message}</div>
        </div>
      )}

      <h2 className="section-title">Theatres</h2>

      <div className="city-bar" style={{ background: 'transparent', padding: '0', margin: '0 0 1.5rem 0', border: 'none' }}>
        <button 
          className={`city-chip ${selectedCity === null ? 'active' : ''}`}
          onClick={() => {
            setSelectedCity(null);
            loadTheatresByCity(null);
          }}
        >
          All Cities
        </button>
        {cities.map(city => (
          <button
            key={city.id}
            className={`city-chip ${selectedCity === city.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedCity(city.id);
              loadTheatresByCity(city.id);
            }}
          >
            {city.name}
          </button>
        ))}
      </div>

      <div className="grid grid-3">
        {loading ? (
          <p>Loading theatres...</p>
        ) : theatres.length === 0 ? (
          <p>No theatres found</p>
        ) : (
          theatres.map(t => (
            <div key={t.id} className="card">
              <div className="card-body">
                <h3>🏛️ {t.name}</h3>
                <p>📍 {t.address || 'N/A'}</p>
                <p>🌆 {t.city?.name || ''}, {t.city?.state || ''}</p>
              </div>
              <div className="card-footer">
                <button 
                  className="btn btn-sm btn-outline"
                  onClick={() => viewScreens(t.id, t.name)}
                >
                  View Screens
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
