---
applyTo: "backend/**/*.py"
---

## Backend Python Guidelines

### Django / DRF Conventions

- Use `python-decouple`'s `config()` for every environment variable read — never use `os.environ.get` directly in settings or views.
- All API logic lives in `backend/app/api/views.py`. Keep `backend/app/views.py` and `backend/app/urls.py` as legacy stubs; do not add new logic there.
- DRF viewsets are registered via `DefaultRouter` in `backend/app/api/urls.py` and aggregated in `backend/core/api/urls.py`. Follow this pattern for any new endpoints.
- After adding or modifying a model field, always generate a migration: `python manage.py makemigrations app`.
- The `OutfitSearch` model (`backend/app/models.py`) stores per-request Gemini analysis results. Add nullable fields (`blank=True, null=True`) for any new AI-extracted attributes.

### Gemini Integration

- Model in use: `gemini-2.5-flash`. Do not change the model string without updating `requirements.txt` if the API version changes.
- Always request `response_mime_type: "application/json"` in `generation_config` to get structured output.
- Wrap Gemini and SerpAPI calls in `try/except Exception` and return a graceful error dict; never let an API failure cause an unhandled 500.

### Image Handling

- Use `resize_image()` from `backend/app/api/helper.py` before passing images to Gemini. It caps dimensions at 720 px to control token cost.
- Uploaded images are stored at `backend/media/uploads/` (controlled by `MEDIA_ROOT`). In production, consider cloud storage (S3/GCS) — placeholders are commented out in `settings.py`.

### Settings

- Production settings: `backend/core/settings.py` — requires `DATABASE_URL`, `SECRET_KEY`, `GEMINI_API_KEY`, `SERP_API_KEY`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`.
- Dev settings: `backend/core/dev_settings.py` — uses SQLite and `DEBUG=True`. Select with `DJANGO_SETTINGS_MODULE=core.dev_settings`.
- `CORS_ALLOWED_ORIGIN_REGEXES` includes `r"^https://.*\.vercel\.app$"` to handle Vercel preview URLs automatically.

### Testing

```bash
cd backend
python manage.py test          # runs Django test suite
```

There are no frontend-facing tests configured yet. Add tests under `backend/app/tests/`.
