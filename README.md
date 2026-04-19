# VibeCheck (BMS)

A full-stack movie booking application built with Spring Boot (backend), MySQL (database), and React + Vite (frontend).

## Features

- User registration and login
- Browse movies and movie details
- Browse cities, theatres, screens, and shows
- View available seats for a show
- Book seats and view booking history
- Cancel existing bookings
- Admin page for management flows

## Tech Stack

### Backend

- Java (as configured in `pom.xml`)
- Spring Boot `4.0.4`
- Spring Web MVC
- Spring Data JPA
- MySQL
- Maven Wrapper (`mvnw`, `mvnw.cmd`)

### Frontend

- React `19`
- Vite `8`
- React Router DOM `7`
- Axios
- ESLint

## Project Structure

```text
BMS/
├── src/main/java/com/sharib/BMS/
│   ├── config/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── enums/
│   ├── exception/
│   ├── repository/
│   └── service/
├── src/main/resources/
│   ├── application.properties
│   └── Velvet.sql
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   └── api.js
│   └── package.json
├── pom.xml
└── README.md
```

## Prerequisites

- Java (matching your `pom.xml` setting)
- Maven (optional, wrapper included)
- Node.js and npm
- MySQL running locally or remotely

## Environment Configuration

The backend reads environment variables with local fallbacks from `src/main/resources/application.properties`.

### Backend environment variables

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `MYSQLHOST` (fallback path)
- `MYSQLPORT` (fallback path)
- `MYSQLDATABASE` (fallback path)
- `MYSQLUSER` (fallback path)
- `MYSQLPASSWORD` (fallback path)
- `PORT` (defaults to `8080`)

### Frontend environment variables

- `VITE_DEV_API_TARGET` (defaults to `http://localhost:8080`)

## Database Setup

1. Create a MySQL database (for local dev, commonly `vibecheck_db`).
2. Update connection values if needed via environment variables.
3. Optional seed data:
   - Run SQL from `src/main/resources/Velvet.sql`.
   - If your local DB is not named `railway`, change the `USE railway;` line before running.

## Run Locally

### 1) Start backend (Spring Boot)

From the project root:

#### Windows

```powershell
.\mvnw.cmd spring-boot:run
```

#### macOS / Linux

```bash
./mvnw spring-boot:run
```

Backend default URL: `http://localhost:8080`

### 2) Start frontend (React + Vite)

From `frontend/`:

```bash
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`

The Vite dev server proxies `/api` requests to the backend target.

## Build Commands

### Backend

```bash
# from project root
./mvnw clean package
```

### Frontend

```bash
# from frontend/
npm run build
npm run preview
```

## API Overview

Base URL (local): `http://localhost:8080`

### Users

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users`
- `GET /api/users/{id}`

### Movies

- `POST /api/movies`
- `GET /api/movies`
- `GET /api/movies/{id}`
- `GET /api/movies/search?title=...`
- `GET /api/movies/genre/{genre}`
- `GET /api/movies/language/{language}`
- `PUT /api/movies/{id}`
- `DELETE /api/movies/{id}`

### Cities

- `POST /api/cities`
- `GET /api/cities`
- `GET /api/cities/{id}`

### Theatres

- `POST /api/theatres/addTheatre`
- `GET /api/theatres`
- `GET /api/theatres/{id}`
- `GET /api/theatres/city/{cityId}`

### Screens

- `POST /api/screens/addScreen`
- `GET /api/screens`
- `GET /api/screens/{id}`
- `GET /api/screens/theatre/{theatreId}`

### Seats

- `POST /api/seats/addSeat`
- `GET /api/seats/screen/{screenId}`
- `GET /api/seats/{id}`

### Shows

- `POST /api/shows/addShow`
- `GET /api/shows`
- `GET /api/shows/{id}`
- `GET /api/shows/movie/{movieId}`
- `GET /api/shows/movie/{movieId}/date?date=YYYY-MM-DD`

### Bookings

- `POST /api/bookings`
- `GET /api/bookings/{id}`
- `GET /api/bookings/user/{userId}`
- `PUT /api/bookings/{id}/cancel`
- `GET /api/bookings/show/{showId}/available-seats`

## Test

From project root:

```bash
./mvnw test
```

## Deployment Notes

- Backend port is controlled by `PORT` (important for cloud platforms).
- Use `SPRING_DATASOURCE_*` variables for production deployments.
- Frontend can be deployed separately (for example Vercel), and backend as a Spring Boot service.

## Current Authentication Model

- Login/register flow is API-based.
- Frontend stores auth/user context locally.
- No JWT/session security is currently enabled.

## License

No license has been defined yet.
