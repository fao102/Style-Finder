# Style Finder

**AI‑powered outfit search & price comparison**

Style Finder is a full‑stack application built to showcase modern web development practices and hands‑on experience with large language models. Users upload a photo of an outfit, the backend analyzes it with Google’s Gemini AI, formulates a query, and then searches Google Shopping via SerpAPI to surface visually similar, lower‑cost alternatives.

Engineered for maintainability and clarity, the project is intended for recruiters, employers, or collaborators to review end‑to‑end architecture, coding conventions and deployment strategy.

---

## Highlights

- **Gemini 2.5 Flash** for image understanding (JSON mode)
- **SerpAPI / Google Shopping** integration for product lookup
- React + Vite frontend with Bootstrap styling
- Django REST backend deployed in Docker on Railway
- Optional authentication via Clerk
- CI/CD pipeline triggers on branch `prodcution` (intentional typo)

---

## Architecture Overview

### Backend

- Django 5.2.4 + DRF handles uploads, AI calls and search logic.
- Primary logic lives in `app/api/views.py` (UploadImageViewSet).
- `app/api/helper.py` contains utilities such as `resize_image`.
- SQLite used for local development; PostgreSQL in production.
- `entry.sh` runs migrations then launches Gunicorn.

### Frontend

- React 19 SPA with functional components and hooks.
- Key components: `imageUploader`, `resultsGrid`, `productCard`.
- Clerk authentication is wrapped around the app but optional.
- Configuration via Vite environment variables.

### Data Flow

1. User posts image → backend saves & resizes (720px max).
2. Backend sends prompt to Gemini and parses the returned JSON.
3. A search query is constructed and submitted to SerpAPI.
4. API returns product list; frontend renders responsive cards.

---

## Tech Stack

| Layer       | Tools / Libraries                         |
|-------------|-------------------------------------------|
| Backend     | Python 3.11, Django, DRF, Pillow, dj‑database‑url |
| AI & Search | google‑generativeai, requests, SerpAPI     |
| Frontend    | React, Vite, Bootstrap, Axios            |
| Deployment  | Docker, Railway (backend), Vercel (frontend) |
| CI / Testing| GitHub Actions, pytest, ESLint           |
| Auth        | Clerk (optional)                         |
| Database    | PostgreSQL (prod), SQLite (dev)          |

---

## Development Setup

### Prerequisites

- Node 20.19+ / 22.12+
- Python 3.10+ (3.11 recommended)
- Git, Docker (for local production simulation)
- Google Gemini & SerpAPI API keys

### Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# populate .env with keys & settings
python manage.py migrate
python manage.py runserver
```

Use `DJANGO_SETTINGS_MODULE=core.dev_settings` to run with SQLite.

### Frontend

```bash
cd frontend
npm ci
cp .env.example .env
# set VITE_API_URL to backend endpoint
npm run dev
```

Head to `http://localhost:5173`. Auth buttons appear if `VITE_CLERK_PUBLISHABLE_KEY` is defined.

---

## Environment Variables

**Backend (.env)**

```env
SECRET_KEY=…
DATABASE_URL=postgres://…
GEMINI_API_KEY=…
SERP_API_KEY=…
ALLOWED_HOSTS=…
CORS_ALLOWED_ORIGINS=…
DEBUG=False     # set True for dev
```

**Frontend (.env)**

```env
VITE_API_URL=http://localhost:8000/api/outfit_searches/
VITE_CLERK_PUBLISHABLE_KEY=…
```

---

## Deployment

### Backend (Railway / Docker)

- Dockerfile located at `backend/Dockerfile.dockerfile`.
- `entry.sh` migrates and starts Gunicorn on `$PORT`.
- GitHub Actions builds and pushes on branch `prodcution`.

### Frontend (Vercel)

- Standard Vite build; `npm run build` produces static output.
- Connect the repository to Vercel and set environment variables accordingly.

### Local Production Simulation

```bash
cd backend
docker-compose up --build
```

This starts Postgres + Django for integration testing.

---

## API Reference

### `POST /api/outfit_searches/`

Upload an outfit image and receive product recommendations.

- **Headers**: `Content-Type: multipart/form-data`
- **Body**: `image` (file)

**Response sample**:

```json
{
  "refined_label": "Men's navy slim-fit blazer",
  "products": [
    {
      "title": "...",
      "price": "...",
      "link": "...",
      "thumbnail": "...",
      "source": "..."
    }
  ]
}
```

All CRUD operations exist since `UploadImageViewSet` extends `ModelViewSet`.

---

## Code Quality & Testing

- Python code follows PEP 8; linting aided by Pylance.
- Frontend linting via ESLint (`npm run lint`).
- Run Django tests with `python manage.py test`.
- CI pipeline includes lint checks and a Docker build step.

---

## Contribution Guidelines

Pull requests are welcome. Please:

1. Fork the repo and create a feature branch.
2. Add tests for new functionality.
3. Follow existing coding conventions.
4. Update documentation when behavior changes.

---

## Roadmap

- Price filtering & sort options
- User accounts & search history
- Save/favorite products
- Multiple image uploads
- Caching Gemini responses

---

## Acknowledgements

Thanks to Google Gemini, SerpAPI, React, Bootstrap, Django and the broader open‑source community for enabling this project.

---

## License

MIT License – see [LICENSE](LICENSE).



## How It Works

1. **Image Upload**: User uploads an outfit image through the React frontend
2. **Image Resize**: Backend resizes the image to 720px max dimension for faster processing
3. **AI Analysis**: Google Gemini analyzes the image and extracts:
   - Gender (Men/Women/Unisex)
   - Type (T-shirt, Blazer, Dress, etc.)
   - Color
   - Fit (Slim fit, Oversized, etc.)
   - Style summary
4. **Product Search**: SerpAPI searches Google Shopping for similar products using the style summary
5. **Results Display**: Frontend displays the products in a responsive grid with images, prices, and links

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
SERP_API_KEY=your-serpapi-key
DEBUG=True
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api/outfit_searches/
```

## Getting API Keys

- **Gemini API**: Get your free API key at [Google AI Studio](https://makersuite.google.com/app/apikey)
- **SerpAPI**: Sign up for a free account at [SerpAPI](https://serpapi.com/)

## Development

### Run Backend Tests
```bash
cd backend
python manage.py test
```

### Build Frontend for Production
```bash
cd frontend
npm run build
```

### Lint Frontend Code
```bash
cd frontend
npm run lint
```

## Troubleshooting

### CORS Issues
Make sure `CORS_ALLOW_ORIGINS` in `backend/core/settings.py` includes your frontend URL (default: `http://localhost:5173`).

### API Key Errors
Verify your `.env` files are properly configured with valid API keys.

### Image Upload Fails
Check that your Django `MEDIA_ROOT` and `MEDIA_URL` settings are properly configured.

## Future Enhancements

- [ ] Add price range filters
- [ ] Save favorite products
- [ ] Compare multiple outfits
- [ ] Social sharing features
- [ ] User accounts and history
- [ ] Advanced filtering (brand, size, etc.)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for image analysis
- SerpAPI for product search capabilities
- Bootstrap for UI components
- React and Vite communities