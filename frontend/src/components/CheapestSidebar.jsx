import React from "react";

export function topCheapest(items, n = 5) {
   
  return [...items]
    .filter((it) => it.extracted_value == null)
    .sort((a, b) => a.extracted_value - b.extracted_value)
    .slice(0, n);


}

export default function CheapestSidebar({ results }) {
    const { refined_label, products } = results;
    const cheapest = topCheapest(products, 5);

    return (
        <aside >
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-white fw-semibold">
            Cheapest Matches
            </div>

            <ul className="list-group list-group-flush">
            {cheapest.map((item, idx) => (
                <li key={idx} className="list-group-item">
                <div>
            
                    {/* Image */}
                    <img
                    src={item.thumbnail || item.image}
                    alt={item.title}
                    className="rounded"
                    style={{
                        width: "55px",
                        height: "55px",
                        objectFit: "cover",
                        flexShrink: 0
                    }}
                    />

                    {/* Text */}
                    <div className="ms-3 flex-grow-1">
                    <div
                        className="fw-semibold text-truncate"
                        style={{ maxWidth: "150px" }}
                        title={item.title}
                    >
                        {item.title}
                    </div>

                    <div className="text-muted small fw-semibold">
                        {item.price?.extracted_value
                        ? `$${item.price.extracted_value}`
                        : item.price || "—"}
                    </div>
                    </div>

                    {/* View button */}
                    <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-secondary btn-sm"
                    >
                    View
                    </a>

                </div>
                </li>
            ))}
            </ul>
        </div>
        </aside>
  );
}
