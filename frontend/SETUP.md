# React Frontend for BookMyShow

This is the React frontend built with Vite, replacing the vanilla JavaScript UI.

## Features

- ⚛️ Built with React + Vite (fast development experience)
- 🛣️ React Router for navigation
- 📡 Axios for API calls with proxy to Spring Boot backend
- 🎨 Uses existing `style.css` from the original UI
- ⚡ Hot Module Replacement (HMR) for instant updates
- 📦 Minimal dependencies

## Installation

```bash
cd frontend
npm install
```

## Development

Start the Vite dev server (runs on http://localhost:5173):
```bash
npm run dev
```

**Important**: Make sure your Spring Boot backend is running on `http://localhost:8080` before starting the frontend. The frontend proxies all `/api` calls to the backend.

## Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production build.

## Production API Configuration

Set `VITE_API_BASE_URL` to your deployed backend API base. This project already includes:

```env
VITE_API_BASE_URL=https://projectbookings-production-eae9.up.railway.app/api
```

If your frontend platform supports environment variables (Vercel, Netlify, etc.), add the same key there.

To serve the build locally:
```bash
npm run preview
```

## Integrate with Spring Boot

To serve the React app from Spring Boot:

1. Build the React app:
   ```bash
   npm run build
   ```

2. Copy `dist` folder to `src/main/resources/static`:
   ```bash
   cp -r dist/* ../src/main/resources/static/
   ```

3. Start Spring Boot and access the app at `http://localhost:8080`

## Project Structure

```
frontend/
├── src/
│   ├── api.js                 # Axios API wrapper (all endpoints)
│   ├── App.jsx                # Main app with React Router
│   ├── main.jsx               # Entry point
│   ├── style.css              # Copied from original UI
│   ├── pages/
│   │   └── MoviesPage.jsx     # Movies listing component
│   └── ...more components...
├── vite.config.js             # Vite config with API proxy
├── package.json
└── ...
```

## Available Pages

- `/` - Home
- `/movies` - Movies listing (functional)
- `/theatres` - Theatres page (placeholder)
- `/bookings` - Bookings page (placeholder)
- `/admin` - Admin panel (placeholder)

## Migrating More Pages

To add more React components:

1. Create a new file in `src/pages/` (e.g., `TheatresPage.jsx`)
2. Import API functions from `src/api.js`
3. Use React hooks (`useState`, `useEffect`) for state and API calls
4. Add route in `src/App.jsx`

Example:
```jsx
import { TheatreAPI } from '../api';

export default function TheatresPage() {
  const [theatres, setTheatres] = useState([]);
  
  useEffect(() => {
    TheatreAPI.getAll().then(setTheatres);
  }, []);
  
  return (
    <div className="container">
      {theatres.map(t => <div key={t.id}>{t.name}</div>)}
    </div>
  );
}
```

## CSS

The existing `style.css` is imported directly in `App.jsx`. All Bootstrap-like utility classes from the original UI are available.

## Notes

- The old `UI/UI/UI` HTML pages still exist as fallback during migration
- Gradually replace them with React components
- API endpoints use the same backend as before
- CORS is already configured in Spring Boot (`CorsConfig.java`)
