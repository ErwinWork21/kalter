### Kalkulator Dokter

Modern React application for calculating and managing doctor-related data with Supabase authentication, routing, charts, and optional PHP backend integration.

---

## Features

- **React 18 + CRA runtime**: `react-scripts` for dev/build/test
- **Routing**: `react-router-dom@6`
- **Auth & data**: Supabase client (`@supabase/supabase-js@2`)
- **Data fetching**: `@tanstack/react-query`
- **Charts**: `recharts`
- **Styling**: Tailwind CSS
- **Icons**: `lucide-react`
- **Optional backend**: PHP endpoint adapter via `src/api.js` (toggleable)

---

## Tech Stack

- React 18, React DOM
- React Router v6
- TanStack Query v5
- Recharts
- Tailwind CSS (PostCSS + Autoprefixer)
- Supabase JS v2

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase project (for authentication) if using Supabase login

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root with:

```bash
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These are read in `src/supabaseClient.js`.

### Available Scripts

```bash
npm start   # Start dev server
npm build   # Production build
npm test    # Run tests (Jest via react-scripts)
npm run eject  # Eject CRA (irreversible)
```

---

## Project Structure

```text
public/
  index.html
src/
  api.js                # Optional PHP backend adapter (toggle via window.USE_API)
  App.js                # App routes and guards
  auth/
    useSupabaseSession.js
  components/
    DashboardSkeleton.jsx
    NavItem.jsx
    SummaryPair.jsx
  pages/
    Dashboard.jsx
    DashboardHome.jsx
    InputDataPage.jsx
    LandingPage.jsx
    LoginPage.jsx
    RegisterPage.jsx
    RiwayatPage.jsx
  supabaseClient.js     # Supabase client setup
  utils/
    tax.js
```

Key routes are defined in `src/App.js`. Auth-aware routes use `useSupabaseSession` to guard the dashboard.

---

## Running Locally

1) Ensure `.env` is configured (see above) if using Supabase auth
2) Start the app:

```bash
npm start
```

The app will be available at `http://localhost:3000/` by default.

---

## Optional: PHP Backend Integration

`src/api.js` enables calling a PHP backend if the following globals are set (e.g., in `public/index.html` before the root div):

```html
<script>
  window.USE_API = true;                // enable backend calls
  window.API_BASE = '/backend';         // path containing api.php
</script>
```

When enabled, the app will call `API_BASE + '/api.php?action=...'` for actions like `login`, `register`, `saveCalculation`, etc. When disabled, it falls back to local behavior (e.g., localStorage stubs).

### Shared Hosting (Rumahweb) quick steps

The repository includes `README-deploy.txt` with a fuller guide. Summary:

- Create MySQL DB and user in cPanel; import `schema.sql`
- Configure DB credentials in `backend/db.php`
- Upload `backend/api.php` and `backend/db.php` to your hosting (e.g., `/public_html/backend/`)
- Build the frontend locally (`npm run build`) and upload the contents of `build/` to `/public_html/`
- Set `window.USE_API` and `window.API_BASE` to point to your backend path

For security, ensure HTTPS, restrict CORS, validate inputs, and use prepared statements.

---

## Deployment

### Static hosting (Netlify, Vercel, GitHub Pages)

1) Build the app:

```bash
npm run build
```

2) Deploy the `build/` directory to your provider. If you need the PHP backend, deploy it separately to a PHP-capable host and configure `window.API_BASE`.

### Environment variables in hosting

Set `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` in your hosting provider’s environment settings to match your `.env` when building there.

---

## Configuration Notes

- Tailwind is configured via `tailwind.config.js` and `postcss.config.js`
- Browser support is governed by `browserslist` in `package.json`
- Ensure Supabase URL and anon key are valid; sessions are persisted and tokens auto-refreshed per `supabaseClient.js`

---

## Troubleshooting

- Missing auth/session: verify `.env` values and that Supabase project auth is enabled
- 404 on routes when deployed: ensure SPA fallback is configured on your host (serving `index.html`)
- Backend calls failing: confirm `window.USE_API = true` and `window.API_BASE` path is correct; check CORS and HTTPS

---

## Contributing

1) Fork the repo and create a feature branch
2) Make changes with clear commits
3) Open a PR with a concise description and screenshots if UI changes

---

## License

No license specified. If you plan to publish/distribute, consider adding a license (e.g., MIT).


