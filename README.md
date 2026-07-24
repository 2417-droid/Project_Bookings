# VibeCheck 🎬

A full-stack movie ticket booking platform built with **Spring Boot** (backend), **PostgreSQL** (database), and **React + Vite** (frontend). Features JWT-secured authentication, transactional seat booking with conflict detection, and an admin dashboard for managing all domain entities.

🔗 **Live Demo**: [vibecheck-puce.vercel.app](https://vibecheck-puce.vercel.app)  
🔗 **Backend API**: [project-bookings.onrender.com](https://project-bookings.onrender.com)

## Features

### User-Facing
- Register and log in with secure JWT authentication (access + refresh tokens)
- Browse movies by title, genre, or language
- View theatres, screens, and showtimes by city
- Select seats with real-time availability and book tickets
- View booking history and cancel existing bookings

### Admin
- Full CRUD operations for movies, cities, theatres, screens, seats, and shows
- Manage all entities from a unified admin dashboard

## Tech Stack

### Backend
- **Java 17** — Spring Boot `4.0.4`
- **Spring Web MVC** — RESTful API layer
- **Spring Data JPA** — ORM with Hibernate and PostgreSQL dialect
- **Spring Security** — Stateless authentication with JWT filter chain
- **jjwt `0.12.5`** — Access/refresh token generation, validation, and parsing
- **PostgreSQL** — Hosted on Supabase (production)
- **Lombok** — Boilerplate reduction
- **Maven Wrapper** — Reproducible builds (`mvnw`, `mvnw.cmd`)

### Frontend
- **React `19`** — Component-based UI
- **Vite `8`** — Dev server with API proxy
- **React Router DOM `7`** — Client-side routing
- **Axios** — HTTP client with JWT interceptor
- **ESLint** — Code quality

### DevOps
- **Docker** — Multi-stage build with non-root runtime user
- **Vercel** — Frontend deployment with SPA rewrites
- **Render** — Backend container deployment (JVM tuned for 512 MB RAM)

## Project Structure

```text
BMS/
├── src/main/java/com/sharib/BMS/
│   ├── config/              # SecurityConfig, CorsConfig
│   ├── controller/          # 9 REST controllers (Auth, Movie, Booking, etc.)
│   ├── dto/                 # Request DTOs (BookingRequest, LoginRequest, etc.)
│   ├── entity/              # 8 JPA entities (Movie, Show, Seat, Booking, etc.)
│   ├── enums/               # BookingStatus, SeatType
│   ├── exception/           # GlobalExceptionHandler
│   ├── repository/          # Spring Data JPA repositories with custom JPQL
│   ├── security/            # JwtUtils, JwtAuthenticationFilter, CustomUserDetailsService
│   └── service/             # Business logic layer
├── src/main/resources/
│   ├── application.properties
│   └── Velvet.sql           # Seed data
├── frontend/
│   ├── src/
│   │   ├── pages/           # 7 page components
│   │   ├── api.js           # Axios client with JWT interceptor
│   │   └── App.jsx          # Root component with routing
│   ├── vercel.json          # Vercel SPA rewrite rules
│   └── package.json
├── Dockerfile               # Multi-stage production build
├── pom.xml
└── README.md
```

## Prerequisites

- Java 17+
- Maven (optional — wrapper included)
- Node.js 18+ and npm
- PostgreSQL instance (local or remote)

## Environment Configuration

### Backend

The backend reads environment variables with local fallbacks defined in `src/main/resources/application.properties`.

| Variable | Description | Default |
|---|---|---|
| `SPRING_DATASOURCE_URL` | JDBC connection string | Supabase PostgreSQL URL |
| `SPRING_DATASOURCE_USERNAME` | Database username | Supabase default |
| `SPRING_DATASOURCE_PASSWORD` | Database password | Supabase default |
| `JWT_SECRET` | HMAC signing key (≥ 32 bytes) | Dev fallback key |
| `PORT` | Server port | `8080` |

### Frontend

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `/api` (proxied via Vite) |
| `VITE_DEV_API_TARGET` | Vite proxy target (dev only) | `http://localhost:8080` |

## Database Setup

1. Create a PostgreSQL database (or use Supabase free tier).
2. Set `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD` environment variables.
3. Hibernate will auto-create tables on startup (`ddl-auto=update`).
4. **Optional seed data**: Run `src/main/resources/Velvet.sql` against your database. Update the `USE` statement if your database name differs.

## Run Locally

### 1) Start the backend (Spring Boot)

From the project root:

**Windows:**
```powershell
.\mvnw.cmd spring-boot:run
```

**macOS / Linux:**
```bash
./mvnw spring-boot:run
```

Backend runs at: `http://localhost:8080`

### 2) Start the frontend (React + Vite)

From the `frontend/` directory:

```bash
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

The Vite dev server proxies `/api` requests to the backend automatically.

## Docker

Build and run the containerized backend:

```bash
# Build
docker build -t vibecheck .

# Run
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=<your-jdbc-url> \
  -e SPRING_DATASOURCE_USERNAME=<your-username> \
  -e SPRING_DATASOURCE_PASSWORD=<your-password> \
  -e JWT_SECRET=<your-secret-key> \
  vibecheck
```

The Dockerfile uses a multi-stage build (build on `eclipse-temurin:21-jdk-alpine`, run on `eclipse-temurin:21-jre-alpine`) with a non-root user and G1GC tuning for memory-constrained environments.

## API Reference

Base URL: `http://localhost:8080`

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT tokens |
| `POST` | `/api/auth/refresh` | Cookie | Refresh access token |
| `POST` | `/api/auth/logout` | Public | Clear refresh token cookie |

### Movies

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/movies` | Add a movie |
| `GET` | `/api/movies` | List all movies |
| `GET` | `/api/movies/{id}` | Get movie by ID |
| `GET` | `/api/movies/search?title=...` | Search by title |
| `GET` | `/api/movies/genre/{genre}` | Filter by genre |
| `GET` | `/api/movies/language/{language}` | Filter by language |
| `PUT` | `/api/movies/{id}` | Update a movie |
| `DELETE` | `/api/movies/{id}` | Delete a movie |

### Cities

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/cities` | Add a city |
| `GET` | `/api/cities` | List all cities |
| `GET` | `/api/cities/{id}` | Get city by ID |

### Theatres

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/theatres/addTheatre` | Add a theatre |
| `GET` | `/api/theatres` | List all theatres |
| `GET` | `/api/theatres/{id}` | Get theatre by ID |
| `GET` | `/api/theatres/city/{cityId}` | Get theatres by city |

### Screens

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/screens/addScreen` | Add a screen |
| `GET` | `/api/screens` | List all screens |
| `GET` | `/api/screens/{id}` | Get screen by ID |
| `GET` | `/api/screens/theatre/{theatreId}` | Get screens by theatre |

### Seats

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/seats/addSeat` | Add a seat |
| `GET` | `/api/seats/screen/{screenId}` | Get seats by screen |
| `GET` | `/api/seats/{id}` | Get seat by ID |

### Shows

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/shows/addShow` | Add a show |
| `GET` | `/api/shows` | List all shows |
| `GET` | `/api/shows/{id}` | Get show by ID |
| `GET` | `/api/shows/movie/{movieId}` | Get shows by movie |
| `GET` | `/api/shows/movie/{movieId}/date?date=YYYY-MM-DD` | Filter by movie and date |

### Bookings

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/bookings` | Create a booking |
| `GET` | `/api/bookings/{id}` | Get booking by ID |
| `GET` | `/api/bookings/user/{userId}` | Get bookings by user |
| `PUT` | `/api/bookings/{id}/cancel` | Cancel a booking |
| `GET` | `/api/bookings/show/{showId}/available-seats` | Get available seats for a show |

### Users

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | List all users |
| `GET` | `/api/users/{id}` | Get user by ID |

## Authentication Flow

1. **Register** — `POST /api/auth/register` with `name`, `email`, `password`. Password is hashed with BCrypt.
2. **Login** — `POST /api/auth/login` returns a short-lived **access token** (15 min) in the response body and sets a long-lived **refresh token** (7 days) as an HTTP-only secure cookie.
3. **Authenticated requests** — The frontend Axios interceptor reads the access token from `localStorage` and attaches it as a `Bearer` token in the `Authorization` header.
4. **Token refresh** — `POST /api/auth/refresh` reads the refresh cookie and returns a new access token.
5. **Logout** — `POST /api/auth/logout` clears the refresh token cookie.

All endpoints except `/api/auth/**` require a valid JWT.

## Build Commands

### Backend

```bash
./mvnw clean package        # Build JAR (from project root)
./mvnw test                 # Run tests
```

### Frontend

```bash
cd frontend
npm run build               # Production build
npm run preview             # Preview production build
npm run lint                # Lint check
```

## Deployment

| Component | Platform | URL |
|---|---|---|
| Frontend | Vercel | [vibecheck-puce.vercel.app](https://vibecheck-puce.vercel.app) |
| Backend | Render | [project-bookings.onrender.com](https://project-bookings.onrender.com) |
| Database | Supabase | PostgreSQL with connection pooling via Supavisor |

> **Note**: The Render free tier spins down after inactivity. The first request may take ~30 seconds to cold-start.

## License

This project is unlicensed.
