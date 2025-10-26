import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import ImageUploader from "./components/imageUploader";

export default function App() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 w-100 bg-light">
      <div className="text-center w-100" style={{ maxWidth: 720 }}>
        <h1 className="mb-4 fw-bold" style={{ letterSpacing: "1px" }}>
          Style Finder
        </h1>
        <section>
          <ImageUploader />
        </section>
      </div>
    </div>
  );
}
