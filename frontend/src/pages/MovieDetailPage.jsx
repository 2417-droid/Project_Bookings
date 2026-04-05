import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MovieAPI, ShowAPI, ScreenAPI, SeatAPI, BookingAPI } from '../api';

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [seats, setSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    loadMovieDetail();
  }, [id]);

  const loadMovieDetail = async () => {
    try {
      setLoading(true);
      const movieId = parseInt(id, 10);
      const movieData = await MovieAPI.getById(movieId);
      setMovie(movieData);
      const showsData = await ShowAPI.getByMovie(movieId);
      console.log('Loaded shows:', showsData);
      setShows(showsData || []);
    } catch (e) {
      console.error('Failed to load movie:', e);
      alert('Movie not found');
      navigate('/movies');
    } finally {
      setLoading(false);
    }
  };

  const getShowScreenId = (show) => {
    if (!show) return null;
    if (show?.screen) {
      return typeof show.screen === 'object' ? show.screen.id : show.screen;
    }
    if (show?.screenId) {
      return show.screenId;
    }
    return null;
  };

  const sortSeats = (seatList = []) => {
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

    return [...seatList].sort((a, b) => {
      const rowA = (a?.row || '').toString().toUpperCase();
      const rowB = (b?.row || '').toString().toUpperCase();
      const rowCmp = collator.compare(rowA, rowB);
      if (rowCmp !== 0) return rowCmp;

      const colA = Number(a?.col);
      const colB = Number(b?.col);
      const hasColA = Number.isFinite(colA);
      const hasColB = Number.isFinite(colB);
      if (hasColA && hasColB && colA !== colB) return colA - colB;

      const seatNumberCmp = collator.compare(a?.seatNumber || '', b?.seatNumber || '');
      if (seatNumberCmp !== 0) return seatNumberCmp;

      return Number(a?.id || 0) - Number(b?.id || 0);
    });
  };

  const openSeatModal = async (show) => {
    console.log('openSeatModal called with show:', show);
    setSelectedShow(show);

    let screenId = getShowScreenId(show);
    console.log('resolved screenId from list show:', screenId);

    if (!screenId) {
      try {
        const detailShow = await ShowAPI.getById(show.id);
        console.log('loaded show detail:', detailShow);
        screenId = getShowScreenId(detailShow);
        console.log('resolved screenId from detail show:', screenId);
      } catch (e) {
        console.error('Failed to load show details for fallback:', e);
      }
    }

    if (!screenId) {
      alert('Could not determine the screen for this show.');
      return;
    }

    try {
      const screenSeats = await SeatAPI.getByScreen(screenId);
      console.log('screenSeats for screenId', screenId, 'count:', screenSeats?.length, 'sample:', screenSeats?.slice(0, 5));
      const sortedSeats = sortSeats(screenSeats || []);
      setSeats(sortedSeats);
    
      // Get available seats and derive booked seat IDs from all seats.
      const availableSeats = await BookingAPI.getAvailableSeats(show.id);
      const availableSeatIds = availableSeats.map((seat) => seat.id);
      console.log('availableSeats for show', show.id, 'count:', availableSeats?.length, 'ids:', availableSeatIds.slice(0, 10));
      const bookedSeatIds = screenSeats
        .map((seat) => seat.id)
        .filter((id) => !availableSeatIds.includes(id));
      setBookedSeats(bookedSeatIds);

      setSelectedSeats([]);
      setShowModal(true);
    } catch (e) {
      console.error('Failed to load seats:', e);
      alert('Failed to load seats.');
    }
  };

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return; // Can't select booked seats
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const getSeatLabel = (seat) => seat.col ?? seat.seatNumber?.match(/\d+/)?.[0] ?? seat.id;

  const seatLayout = useMemo(() => {
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    const grouped = new Map();

    seats.forEach((seat) => {
      const rowKey = (seat?.row || 'NA').toString().toUpperCase();
      if (!grouped.has(rowKey)) grouped.set(rowKey, []);
      grouped.get(rowKey).push(seat);
    });

    const allCols = seats
      .map((seat) => Number(seat?.col))
      .filter((col) => Number.isFinite(col) && col > 0);
    const globalMaxCol = allCols.length ? Math.max(...allCols) : 0;

    const rows = [...grouped.entries()]
      .sort(([rowA], [rowB]) => collator.compare(rowA, rowB))
      .map(([rowLabel, rowSeats]) => {
        const sortedRowSeats = sortSeats(rowSeats);
        const byCol = new Map(
          sortedRowSeats
            .map((seat) => [Number(seat?.col), seat])
            .filter(([col]) => Number.isFinite(col) && col > 0)
        );

        return { rowLabel, sortedRowSeats, byCol };
      });

    return { rows, globalMaxCol };
  }, [seats]);

  const confirmBooking = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      alert('Please login to book');
      navigate('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    try {
      const bookingRequest = {
        userId: user.id,
        showId: selectedShow.id,
        seatIds: selectedSeats,
      };

      await BookingAPI.add(bookingRequest);

      alert('Booking confirmed!');
      setShowModal(false);
      navigate('/bookings');
    } catch (e) {
      console.error('Booking error:', e.response?.data || e);
      const message = e.response?.data?.message || e.response?.data?.error || e.message || 'Failed to create booking.';
      alert('Booking failed: ' + message);
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (!movie) return <div className="container"><p>Movie not found</p></div>;

  const posterUrl = movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster';
  const totalPrice = selectedSeats.length * (selectedShow?.ticketPrice || 0);

  return (
    <div className="container">
      {/* Movie Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div>
          <img
            src={posterUrl}
            alt={movie.title}
            style={{ width: '100%', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
          />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary)' }}>{movie.title}</h1>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {movie.genre && <span className="badge" style={{ background: 'var(--primary)' }}>{movie.genre}</span>}
            {movie.language && <span className="badge" style={{ background: 'var(--secondary)' }}>{movie.language}</span>}
            {movie.rating && <span className="badge" style={{ background: 'var(--accent)' }}>{movie.rating}/10</span>}
            {movie.durationMinutes && <span className="badge">{movie.durationMinutes} mins</span>}
          </div>

          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            {movie.description}
          </p>

          {movie.releaseDate && (
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>
              <strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Shows Section */}
      <h2 className="section-title">Available Shows</h2>
      {shows.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No shows available</p>
      ) : (
        <div className="shows-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {shows.map(show => (
            <div key={show.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                  {show.screen?.theatre?.name || show.theatre?.name || 'Theatre'}
                  {' • '}
                  {show.screen?.theatre?.city?.name || show.city?.name || 'City'}
                  {' • '}
                  {show.screen?.name || 'Screen'}
                </p>
                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text)' }}>
                  {new Date(show.showDate).toLocaleDateString()} at {show.startTime}
                </p>
              </div>

              <p style={{ marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700', color: 'var(--primary)' }}>
                ₹{show.ticketPrice}
              </p>

              <button
                className="btn btn-primary"
                onClick={() => openSeatModal(show)}
                style={{ marginTop: 'auto' }}
              >
                Select Seats
              </button>
            </div>
          ))}
        </div>
      )}
      {showModal && selectedShow && (
        <div className="modal-overlay active" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Select Your Seats</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {new Date(selectedShow.showDate).toLocaleDateString()} at {selectedShow.startTime}
            </p>

            {/* Seat Grid */}
            <div className="seat-grid-shell" style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1.5rem' }}>
              <div className="screen-label">Screen</div>
              <div className="screen-indicator"></div>

              <div className="seat-map" style={{ marginTop: '0.8rem' }}>
                {seatLayout.rows.map((row) => (
                  <div key={row.rowLabel} className="seat-row">
                    <div className="seat-row-label">{row.rowLabel}</div>

                    <div
                      className="seat-row-grid"
                      style={
                        seatLayout.globalMaxCol > 0
                          ? { gridTemplateColumns: `repeat(${seatLayout.globalMaxCol}, 36px)` }
                          : undefined
                      }
                    >
                      {seatLayout.globalMaxCol > 0
                        ? Array.from({ length: seatLayout.globalMaxCol }, (_, idx) => {
                            const colNumber = idx + 1;
                            const seat = row.byCol.get(colNumber);
                            if (!seat) {
                              return <span key={`${row.rowLabel}-${colNumber}`} className="seat-empty" />;
                            }

                            const isBooked = bookedSeats.includes(seat.id);
                            const isSelected = selectedSeats.includes(seat.id);

                            return (
                              <button
                                key={seat.id}
                                className={`seat ${isBooked ? 'booked' : isSelected ? 'selected' : 'available'}`}
                                onClick={() => toggleSeat(seat.id)}
                                disabled={isBooked}
                                title={seat.seatNumber || `${row.rowLabel}${getSeatLabel(seat)}`}
                              >
                                {getSeatLabel(seat)}
                              </button>
                            );
                          })
                        : row.sortedRowSeats.map((seat) => {
                            const isBooked = bookedSeats.includes(seat.id);
                            const isSelected = selectedSeats.includes(seat.id);

                            return (
                              <button
                                key={seat.id}
                                className={`seat ${isBooked ? 'booked' : isSelected ? 'selected' : 'available'}`}
                                onClick={() => toggleSeat(seat.id)}
                                disabled={isBooked}
                                title={seat.seatNumber || `${row.rowLabel}${getSeatLabel(seat)}`}
                              >
                                {getSeatLabel(seat)}
                              </button>
                            );
                          })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seat Legend */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', fontSize: '0.9rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '20px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                <span>Available</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '20px', height: '20px', background: 'var(--primary)', borderRadius: '4px' }}></div>
                <span>Selected</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '20px', height: '20px', background: '#333', borderRadius: '4px' }}></div>
                <span>Booked</span>
              </div>
            </div>

            {/* Booking Summary */}
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <p>Seats: {selectedSeats.length}</p>
                <p>@ ₹{selectedShow.ticketPrice} each</p>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: '700', color: 'var(--primary)' }}>
                <p>Total:</p>
                <p>₹{totalPrice}</p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn btn-primary"
                onClick={confirmBooking}
                disabled={selectedSeats.length === 0}
                style={{ flex: 1 }}
              >
                Confirm Booking
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
