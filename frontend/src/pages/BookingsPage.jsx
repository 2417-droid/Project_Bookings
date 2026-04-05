import React, { useState, useEffect } from 'react';
import { BookingAPI } from '../api';
import { Link } from 'react-router-dom';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(userData);

    if (!userData) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const bookingsData = await BookingAPI.getByUser(userData.id);
      setBookings(bookingsData);
    } catch (e) {
      console.error('Failed to load bookings:', e);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await BookingAPI.cancel(bookingId);
      alert('Booking cancelled');
      loadBookings();
    } catch (e) {
      alert('Could not cancel booking');
    }
  };

  if (!user) {
    return (
      <div className="container">
        <h2 className="section-title">My Bookings</h2>
        <div className="empty-state">
          <div className="icon">🔐</div>
          <p>Please <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>login</Link> to view your bookings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="section-title">My Bookings</h2>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <p>No bookings yet. Go <Link to="/movies" style={{ color: 'var(--primary)' }}>book some movies</Link>! 🎬</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map(b => (
            <div 
              key={b.id} 
              className="card" 
              style={{
                border: b.status === 'CANCELLED' 
                  ? '1px solid rgba(255,0,122,0.35)' 
                  : '1px solid rgba(34,197,94,0.35)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.3rem' }}>🎬 {b.show?.movie?.title || 'Movie'}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    🏛️ {b.show?.screen?.theatre?.name || ''} — {b.show?.screen?.name || ''}<br/>
                    📅 {b.show?.showDate || ''} 🕐 {b.show?.startTime || ''}<br/>
                    💺 Seats: {b.seats ? b.seats.map(s => s.seatNumber).join(', ') : 'N/A'}<br/>
                    🕑 Booked: {b.bookedAt ? new Date(b.bookedAt).toLocaleString() : ''}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: b.status === 'CANCELLED' ? 'var(--accent)' : 'var(--success)',
                    marginBottom: '0.5rem'
                  }}>
                    ₹{b.totalPrice || 0}
                  </div>
                  <span 
                    className="badge"
                    style={{
                      background: b.status === 'CANCELLED' 
                        ? 'rgba(255,0,122,0.2)' 
                        : 'rgba(34,197,94,0.2)',
                      color: b.status === 'CANCELLED' ? 'var(--accent)' : 'var(--success)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '4px'
                    }}
                  >
                    {b.status}
                  </span>
                  {b.status === 'CONFIRMED' && (
                    <button 
                      className="btn btn-sm btn-danger" 
                      style={{ marginTop: '0.5rem', display: 'block' }}
                      onClick={() => cancelBooking(b.id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
