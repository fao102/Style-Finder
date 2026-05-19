import React from "react";
import ProductCard from "./ProductCard";
import CheapestSidebar from "./CheapestSidebar";

export default function ResultsGrid({ results }) {
  const { refined_label, products } = results;
 

  return (
    <div>
      <h5 className="fw-semibold text-muted mb-3">
        <span className="text-dark">{refined_label}</span>
      </h5>

      <div className="row g-4">
        {products.map((item, idx) => (
          <div className="col-6 col-md-4 col-lg-3" key={idx}>
            <ProductCard item={item} />
          </div>
        ))}
      </div>

     
    </div>
  );
}
