import React from "react";

const API_URL = import.meta.env.VITE_API_URL;

function extractPrice(item) {
  return item.extracted_price ?? item.price?.extracted_value ?? null;
}

function topCheapest(items, n = 3) {
  return [...items]
    .filter((it) => extractPrice(it) != null)
    .sort((a, b) => extractPrice(a) - extractPrice(b))
    .slice(0, n);
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function HistoryCard({ item }) {
  const { image, style_summary, gender, outfit_type, color, fit, results = [], created_at } = item;
  const products = results.slice(0, 6);
  const cheapest = topCheapest(results);
  const imageUrl = image?.startsWith("http") ? image : `${API_URL}${image}`;

  return (
    <div className="card shadow-sm mb-4 border-0">
      {/* Header */}
      <div className="card-header bg-white d-flex justify-content-between align-items-center py-2 px-3">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="fw-semibold text-dark">{style_summary || "Unknown outfit"}</span>
          {gender && <span className="badge bg-secondary fw-normal">{gender}</span>}
          {outfit_type && <span className="badge bg-light text-dark border fw-normal">{outfit_type}</span>}
          {color && <span className="badge bg-light text-dark border fw-normal">{color}</span>}
          {fit && <span className="badge bg-light text-dark border fw-normal">{fit}</span>}
        </div>
        <small className="text-muted text-nowrap ms-3">{formatDate(created_at)}</small>
      </div>

      {/* Body */}
      <div className="card-body p-3">
        <div className="row g-3 align-items-start">

          {/* Uploaded outfit image */}
          <div className="col-12 col-sm-3 col-md-2">
            <img
              src={imageUrl}
              alt="Uploaded outfit"
              className="rounded w-100"
              style={{ objectFit: "cover", aspectRatio: "3/4", maxHeight: 200 }}
            />
          </div>

          {/* Product thumbnails grid */}
          <div className="col-12 col-sm-5 col-md-6">
            <p className="text-muted small mb-2 fw-semibold">
              Products found{results.length > 0 ? ` (${results.length})` : ""}
            </p>
            {products.length > 0 ? (
              <div className="d-flex flex-wrap gap-2">
                {products.map((p, i) => (
                  <a key={i} href={p.product_link || p.link} target="_blank" rel="noopener noreferrer">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      title={p.title}
                      className="rounded border"
                      style={{ width: 72, height: 72, objectFit: "cover" }}
                    />
                  </a>
                ))}
                {results.length > 6 && (
                  <div
                    className="rounded border d-flex align-items-center justify-content-center bg-light text-muted small"
                    style={{ width: 72, height: 72, fontSize: 12 }}
                  >
                    +{results.length - 6} more
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted small">No products found.</p>
            )}
          </div>

          {/* Cheapest results */}
          <div className="col-12 col-sm-4 col-md-4">
            <p className="text-muted small mb-2 fw-semibold">Cheapest</p>
            {cheapest.length > 0 ? (
              <ul className="list-unstyled mb-0">
                {cheapest.map((p, i) => (
                  <li key={i} className="d-flex align-items-center gap-2 mb-2">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="rounded border flex-shrink-0"
                      style={{ width: 40, height: 40, objectFit: "cover" }}
                    />
                    <div className="overflow-hidden">
                      <a
                        href={p.product_link || p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none text-dark"
                      >
                        <div className="fw-semibold small text-success">
                          {extractPrice(p) != null
                            ? `£${extractPrice(p).toFixed(2)}`
                            : p.price || "—"}
                        </div>
                        <div
                          className="text-muted text-truncate"
                          style={{ fontSize: 11, maxWidth: 140 }}
                          title={p.title}
                        >
                          {p.source || p.title}
                        </div>
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted small">No price data available.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
