import axios from 'axios';

const API_BASE = '/api';

// Helper functions
const apiGet = (endpoint) => axios.get(`${API_BASE}${endpoint}`).then(res => res.data);
const apiPost = (endpoint, data) => axios.post(`${API_BASE}${endpoint}`, data).then(res => res.data);
const apiPut = (endpoint, data) => axios.put(`${API_BASE}${endpoint}`, data).then(res => res.data);
const apiDelete = (endpoint) => axios.delete(`${API_BASE}${endpoint}`).then(res => res.data);

// Theatre APIs
export const TheatreAPI = {
    add: (data) => apiPost('/theatres', data),
    getAll: () => apiGet('/theatres'),
    getById: (id) => apiGet(`/theatres/${id}`),
    getByCity: (cityId) => apiGet(`/theatres/city/${cityId}`)
};

// Movie APIs
export const MovieAPI = {
    add: (data) => apiPost('/movies', data),
    getAll: () => apiGet('/movies'),
    getById: (id) => apiGet(`/movies/${id}`),
    search: (title) => apiGet(`/movies/search?title=${encodeURIComponent(title)}`),
    getByGenre: (genre) => apiGet(`/movies/genre/${genre}`),
    getByLanguage: (lang) => apiGet(`/movies/language/${lang}`),
    update: (id, data) => apiPut(`/movies/${id}`, data),
    delete: (id) => apiDelete(`/movies/${id}`)
};

// Screen APIs
export const ScreenAPI = {
    add: (data) => apiPost('/screens', data),
    getAll: () => apiGet('/screens'),
    getById: (id) => apiGet(`/screens/${id}`),
    getByTheatre: (theatreId) => apiGet(`/screens/theatre/${theatreId}`)
};

// City APIs
export const CityAPI = {
    add: (data) => apiPost('/cities', data),
    getAll: () => apiGet('/cities'),
    getById: (id) => apiGet(`/cities/${id}`)
};

// Show APIs
export const ShowAPI = {
    add: (data) => apiPost('/shows', data),
    getAll: () => apiGet('/shows'),
    getById: (id) => apiGet(`/shows/${id}`),
    getByMovie: (movieId) => apiGet(`/shows/movie/${movieId}`),
    getByMovieAndDate: (movieId, date) => apiGet(`/shows/movie/${movieId}/date?date=${date}`)
};

// Seat APIs
export const SeatAPI = {
    add: (data) => apiPost('/seats', data),
    getByScreen: (screenId) => apiGet(`/seats/screen/${screenId}`),
    getById: (id) => apiGet(`/seats/${id}`)
};

// Booking APIs
export const BookingAPI = {
    add: (data) => apiPost('/bookings', data),
    getById: (id) => apiGet(`/bookings/${id}`),
    getByUser: (userId) => apiGet(`/bookings/user/${userId}`),
    getByShow: (showId) => apiGet(`/bookings/show/${showId}`),
    cancel: (id) => apiPut(`/bookings/${id}/cancel`),
    getAvailableSeats: (showId) => apiGet(`/bookings/show/${showId}/available-seats`)
};

// User APIs
export const UserAPI = {
    register: (data) => apiPost('/users/register', data),
    login: (data) => apiPost('/users/login', data),
    getById: (id) => apiGet(`/users/${id}`)
};
