import React, { useState } from "react";
import { uploadImage } from "../api";
import ResultsGrid from "./resultsGrid";

export default function ImageUploader() {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setResults(null);
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const data = await uploadImage(formData);
      setResults(data);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Something went wrong while analyzing your image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm p-4 border-0 mx-auto" style={{ maxWidth: "600px" }}>
      {/* Upload Card */}
      <div className="card-body">
        <h4 className="mb-3 fw-semibold">Upload an Outfit Image</h4>

        <input
          type="file"
          accept="image/*"
          className="form-control mb-3"
          onChange={handleFileChange}
        />

        {image && (
          <div className="mb-3">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="img-fluid rounded shadow-sm"
              style={{
                maxHeight: "300px",
                objectFit: "cover",
                border: "1px solid #e0e0e0",
              }}
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          className="btn btn-dark px-4 py-2"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Find Cheaper Alternatives"}
        </button>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-light bg-opacity-75"
          style={{ zIndex: 1050 }}
        >
          <div className="spinner-border text-dark mb-3" role="status"></div>
          <p className="fw-medium text-secondary">Analyzing outfit, please wait...</p>
        </div>
      )}

      {/* Results Section */}
      {results && (
        <div className="mt-5">
          <ResultsGrid results={results} />
        </div>
      )}
    </div>
  );
}
