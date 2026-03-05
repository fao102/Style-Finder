---
applyTo: "frontend/src/**/*.{js,jsx}"
---

## Frontend React / JavaScript Guidelines

### Component Architecture

- All components live in `frontend/src/components/`. Keep components small and single-purpose.
- `imageUploader.jsx` owns state (`image`, `results`, `loading`) and orchestrates the upload flow. Pass data down as props to `ResultsGrid` and `CheapestSidebar`.
- `resultsGrid.jsx` renders the full product grid from `results.products`.
- `CheapestSidebar.jsx` filters and sorts products to show the cheapest five. The `topCheapest` helper is exported for unit testing.
- `productCard.jsx` is a pure presentational component — it receives a single `item` prop.

### API Integration

- All HTTP calls go through `frontend/src/api.js`. The base URL is read from `import.meta.env.VITE_API_URL`. Do not hard-code URLs in components.
- The `uploadImage(formData)` function posts to `${API_URL}/api/outfit_searches/` with `Content-Type: multipart/form-data`.
- The backend returns `{ refined_label: string, products: ShoppingResult[] }`. The `products` array comes directly from SerpAPI's `shopping_results`.

### SerpAPI Product Shape

Key fields returned per product:

```js
{
  title: string,
  price: string,          // display string e.g. "$49.99"
  extracted_value: number | null,  // numeric price; may be absent
  link: string,           // retailer URL
  product_link: string,   // Google Shopping link (used in ProductCard)
  thumbnail: string,      // image URL
  source: string          // retailer name
}
```

Use `item.extracted_value` for numeric comparisons (sorting cheapest). Use `item.price` for display. Use `item.product_link` for the "View Product" anchor in `ProductCard`.

### Styling

- Bootstrap 5.3 utility classes are preferred. Import via `import 'bootstrap/dist/css/bootstrap.css'` in `App.jsx` (already present).
- Avoid custom CSS unless Bootstrap utilities are insufficient. Put any custom styles in `App.css` or `index.css`.
- Do not use inline style objects for layout that Bootstrap can handle.

### Authentication & Real-time (Clerk / Convex)

- Clerk and Convex are installed (`@clerk/clerk-react`, `convex`) but currently disabled — they are commented out in `main.jsx` and `App.jsx`.
- Do **not** remove the commented-out code.
- Do **not** activate auth unless explicitly requested. When activating, wrap `App` in `<ClerkProvider>` and `<ConvexProviderWithClerk>` and set the required env vars.

### Environment Variables

Read via `import.meta.env.VITE_*`. Required at runtime:

- `VITE_API_URL` — backend URL (no trailing slash), e.g. `http://localhost:8000`

Optional (for future auth):

- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_CONVEX_URL`

### Dev Server

```bash
cd frontend
npm install    # required before first run or after package.json changes
npm run dev    # http://localhost:5173
```

Vite proxying is not configured — the frontend calls the backend directly via `VITE_API_URL`.
