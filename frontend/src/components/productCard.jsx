import React from "react";

export default function ProductCard({ item }) {
  return (
    <div className="card h-100 border-0 shadow-sm">
      <img
        src={item.thumbnail}
        alt={item.title}
        className="card-img-top rounded-top"
        style={{ objectFit: "cover", height: "200px" }}
      />
      <div className="card-body">
        <h6 className="card-title text-truncate">{item.title}</h6>
        <p className="card-text text-muted small mb-1">
          {item.price || "No price available"}
        </p>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="stretched-link text-decoration-none text-primary small"
        >
          View Product
        </a>
      </div>
    </div>
  );
}
