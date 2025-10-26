# Style Finder 👗👔

An AI-powered fashion search application that helps you find cheaper alternatives to outfits in images. Simply upload a photo of an outfit, and Style Finder will analyze it using Google's Gemini AI and search for similar, affordable products online.

## Features

- **AI-Powered Analysis**: Uses Google Gemini 2.5 Flash to analyze outfit images and extract details like gender, type, color, fit, and style
- **Smart Product Search**: Integrates with SerpAPI to find similar and cheaper alternatives from online retailers
- **Clean UI**: Modern, responsive interface built with React and Bootstrap
- **Fast Results**: Efficient image processing and search capabilities

## Tech Stack

### Backend
- **Django 5.2.4** - Web framework
- **Django REST Framework** - API development
- **Google Gemini AI** - Image analysis and outfit understanding
- **SerpAPI** - Product search via Google Shopping
- **Pillow** - Image processing and resizing

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Bootstrap 5.3** - Styling and responsive design
- **Axios** - HTTP client for API requests

## Prerequisites

- Python 3.10+
- Node.js 20.19+ or 22.12+
- Google Gemini API key
- SerpAPI key

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Style-Finder
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
SECRET_KEY=your-django-secret-key
GEMINI_API_KEY=your-gemini-api-key
SERP_API_KEY=your-serpapi-key
```

```bash
# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

The backend will run at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` and configure your API URL:

```env
VITE_API_URL=http://localhost:8000/api/outfit_searches/
```

```bash
# Start development server
npm run dev
```

The frontend will run at `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Click "Choose file" and select an image of an outfit
3. Click "Find Cheaper Alternatives"
4. Wait for the AI to analyze the image (this may take a few seconds)
5. Browse through the suggested products and click on any item to view it on the retailer's website

## Project Structure

```
Style-Finder/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── helper.py      # Image processing utilities
│   │   │   ├── serializers.py # DRF serializers
│   │   │   ├── urls.py        # API routes
│   │   │   └── views.py       # API views and logic
│   │   ├── migrations/
│   │   ├── models.py          # Database models
│   │   └── admin.py           # Django admin config
│   ├── core/
│   │   ├── settings.py        # Django settings
│   │   └── urls.py            # Main URL config
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── imageUploader.jsx  # Main upload component
    │   │   ├── resultsGrid.jsx    # Results display
    │   │   └── productCard.jsx    # Product card component
    │   ├── api.js                 # API client
    │   ├── App.jsx                # Main app component
    │   └── main.jsx               # Entry point
    ├── package.json
    └── vite.config.js
```

## API Endpoints

### POST `/api/outfit_searches/`

Upload an outfit image and get product recommendations.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `image` (file)

**Response:**
```json
{
  "refined_label": "Men's navy slim-fit blazer",
  "products": [
    {
      "title": "Product name",
      "price": "$49.99",
      "link": "https://...",
      "thumbnail": "https://...",
      "source": "Store name"
    }
  ]
}
```

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