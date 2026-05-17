High-level requirements identification

- User uploads outfit photo (multipart/form-data) to backend.
- Backend calls Google Gemini to extract outfit attributes (label, type, color, fit, gender).
- Backend calls SerpAPI Google Shopping with refined prompt to find lower price options.
- Response includes refined label and product list with title, price, link, thumbnail, source.
- Frontend renders upload form and results grid + cheapest items sidebar.
- Security: env-based keys, CORS, CSRF, HTTPS.
- Deployment: backend Docker/Railway, frontend Vercel.

System design

- Django REST Framework API: OutfitSearch model, serializer, ModelViewSet, router.
- Image handling via PIL resize helper; store uploads to media.
- Gemini/SerpAPI integration in view with retries and errors.
- Frontend React 19 + Vite: components for upload, results, product card, cheapest sidebar.
- State management with hooks, API calls via axios wrapper.
- CI/CD: GitHub Actions pipelines for build/test/deploy.

Implementation

- Backend: app/api/views.py handles uploads and pipeline; app/api/serializers.py + models.py.
- Helper: resize_image and analysis stub (fix to avoid dead code).
- Frontend: src/App.jsx, components, api.js.
- Config: core/settings.py and core/dev_settings.py with decouple config, CORS/CSRF.
- Deploy: backend/Dockerfile.dockerfile, entry.sh migrate + gunicorn.

Testing

- Add Django tests for OutfitSearch endpoint, serializer, and helper functions.
- Mock Gemini and SerpAPI calls.
- Frontend tests with Vitest/Jest for components and utility topCheapest.
- Add integration/e2e tests for upload-to-results flow.

Releasing

- Validate environment variables, run migrations.
- Build frontend and backend containers.
- Deploy to Railway (backend), Vercel (frontend).
- Run smoke tests on deployed endpoints.
- Update README/.env.example and deployment docs.

Production monitoring

- Add structured logging and external error tracking (Sentry/Rollbar).
- Track key metrics: upload count, Gemini success rate, API latency, SerpAPI failures.
- Health checks and alert rules (HTTP 200, DB connection, API key validity).
- Rotate API keys and handle rate limiting.
- Routine maintenance: remove orphaned code, keep dependencies updated.
