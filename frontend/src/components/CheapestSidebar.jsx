import React from "react";

function extractPrice(item) {
  return item.extracted_price ?? item.price?.extracted_value ?? null;
}

export function topCheapest(items, n = 5) {
  return [...items]
    .filter((it) => extractPrice(it) != null)
    .sort((a, b) => extractPrice(a) - extractPrice(b))
    .slice(0, n);
}

export default function CheapestSidebar({ results }) {
  const { refined_label, products } = results;
  const cheapest = topCheapest(products, 5);

  return (
    <aside>
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white fw-semibold">
          Cheapest Matches
        </div>

        {cheapest.length === 0 ? (
          <div className="card-body text-muted small">No price data available.</div>
        ) : (
          <ul className="list-group list-group-flush">
            {cheapest.map((item, idx) => (
              <li key={idx} className="list-group-item">
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={item.thumbnail || item.image}
                    alt={item.title}
                    className="rounded flex-shrink-0"
                    style={{ width: 55, height: 55, objectFit: "cover" }}
                  />
                  <div className="flex-grow-1 overflow-hidden">
                    <div
                      className="fw-semibold text-truncate small"
                      style={{ maxWidth: 150 }}
                      title={item.title}
                    >
                      {item.title}
                    </div>
                    <div className="text-success small fw-semibold">
                      {extractPrice(item) != null
                        ? `£${extractPrice(item).toFixed(2)}`
                        : item.price || "—"}
                    </div>
                  </div>
                  <a
                    href={item.product_link || item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-secondary btn-sm flex-shrink-0"
                  >
                    View
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
