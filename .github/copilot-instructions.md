# Style Finder — Copilot Instructions

## Project Overview

Style Finder is a full-stack AI-powered fashion search application. Users upload an outfit photo; the backend analyses it with Google Gemini and searches Google Shopping via SerpAPI for cheaper alternatives. The frontend is a React SPA served by Vite; the backend is a Django REST Framework API deployed on Railway (Docker/Gunicorn) with a PostgreSQL database. The frontend is deployed on Vercel.

## Repository Layout

```
Style-Finder/
├── .github/
│   ├── copilot-instructions.md   ← this file
│   ├── instructions/             ← path-specific instruction files
│   └── workflows/deploy.yml      ← CI/CD (deploys on push to `prodcution` branch — note the typo)
├── backend/
│   ├── app/                      ← Django app (models, serializers, views, migrations)
│   │   ├── api/                  ← DRF viewset, serializer, URL router, helper utilities
│   │   └── migrations/
│   ├── core/                     ← Django project settings, root URLs, WSGI/ASGI
│   │   ├── settings.py           ← production settings (reads from env vars via python-decouple)
│   │   ├── dev_settings.py       ← local dev settings (SQLite, DEBUG=True)
│   │   └── api/urls.py           ← aggregates all app routers
│   ├── Dockerfile.dockerfile
│   ├── entry.sh                  ← container entrypoint: migrate then gunicorn
│   ├── docker-compose.yml        ← local Postgres + web service for testing
│   └── requirements.txt          ← pinned Python deps
└── frontend/
    ├── src/
    │   ├── components/           ← imageUploader, resultsGrid, productCard, CheapestSidebar
    │   ├── App.jsx
    │   ├── api.js                ← axios wrapper (reads VITE_API_URL from env)
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Tech Stack

- **Backend**: Python 3.11, Django 5.2.4, Django REST Framework 3.16, Gunicorn, PostgreSQL (`psycopg2-binary`), `dj-database-url`, `whitenoise`, `python-decouple`
- **AI / Search**: `google-generativeai` 0.8.5 (Gemini 2.5 Flash), SerpAPI (Google Shopping) via `requests`
- **Frontend**: React 19, Vite 7, Bootstrap 5.3, Axios, React Router DOM 7
- **Infrastructure**: Railway (backend Docker), Vercel (frontend), GitHub Actions CI/CD

## Key Environment Variables

### Backend (`.env` in `backend/`)

| Variable | Purpose |
|---|---|
| `SECRET_KEY` | Django secret key |
| `GEMINI_API_KEY` | Google Gemini API |
| `SERP_API_KEY` | SerpAPI key |
| `DATABASE_URL` | PostgreSQL connection string |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins |
| `CSRF_TRUSTED_ORIGINS` | Comma-separated trusted origins |
| `DEBUG` | `True` for dev, `False` for prod |

### Frontend (`.env` in `frontend/`)

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:8000`) |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk auth (currently commented out) |
| `VITE_CONVEX_URL` | Convex URL (currently commented out) |

## Build & Run Commands

### Backend (local dev)

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # then fill in values
python manage.py migrate
python manage.py runserver   # runs on http://localhost:8000
```

Use `DJANGO_SETTINGS_MODULE=core.dev_settings` for local SQLite dev. The default `core.settings` requires a `DATABASE_URL` pointing at Postgres.

### Backend (Docker / production-like)

```bash
cd backend
docker-compose up --build   # starts Postgres + Django on port 8000
```

The `entry.sh` script runs `python manage.py migrate --noinput` then `gunicorn core.wsgi:application --bind 0.0.0.0:$PORT --workers 1`. `$PORT` defaults to 8000 locally.

### Frontend

```bash
cd frontend
npm install   # always run before building or starting dev server
npm run dev   # http://localhost:5173
npm run build
npm run lint
npm run preview
```

## API

### `POST /api/outfit_searches/`

- **Content-Type**: `multipart/form-data`
- **Body field**: `image` (file)
- **Response** (`201`):

```json
{
  "refined_label": "Men's navy slim-fit blazer",
  "products": [ { "title": "...", "price": "...", "link": "...", "thumbnail": "...", "source": "..." } ]
}
```

All other CRUD endpoints are available because `UploadImageViewSet` extends `ModelViewSet`.

## Architecture Notes

- `backend/app/api/views.py` is the single important view. It saves the uploaded image, calls Gemini with a JSON-mode prompt, stores the parsed attributes on the `OutfitSearch` model, then calls SerpAPI and returns results. It does **not** return the stored model data — it returns the live SerpAPI results.
- `backend/app/api/helper.py` contains `resize_image` (PIL thumbnail to 720 px) and an incomplete `analyze_outfit_image` stub. The active Gemini call lives in `views.py`.
- The frontend `api.js` calls `${VITE_API_URL}/api/outfit_searches/` (note: the URL already includes `/api/outfit_searches/`, so avoid duplicating the path).
- Auth (Clerk) and real-time DB (Convex) are installed as dependencies but are **commented out** in `main.jsx` and `App.jsx`. Do not remove them but do not activate them without explicit instruction.
- The GitHub Actions workflow deploys on push to the branch named `prodcution` (deliberate typo in the existing workflow — do not fix unless asked).

## Coding Conventions

- Python: follow PEP 8; use `python-decouple` `config()` for all env reads.
- Django: keep business logic in `views.py`; models stay thin.
- JavaScript/JSX: functional components with hooks; no class components.
- Use Bootstrap utility classes for layout; avoid custom CSS unless necessary.
- Never commit secrets or `.env` files; they are in `.gitignore`.
- Always run `pip install -r requirements.txt` after adding Python deps; use `--break-system-packages` only outside a venv.
- After any model change, create and apply migrations: `python manage.py makemigrations && python manage.py migrate`.
