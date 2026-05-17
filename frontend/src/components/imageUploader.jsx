import React, { useState, useCallback } from "react";
import { uploadImage } from "../api";
import ResultsGrid from "./resultsGrid";
import CheapestSidebar from "./CheapestSidebar";
import { useDropzone } from "react-dropzone";

export default function ImageUploader() {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setImage(acceptedFiles[0]);
      setResults(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setResults(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const data = await uploadImage(formData);
      setResults(data);
    } catch (err) {
      console.error("Upload failed", err);
      if (err.response?.status === 429) {
        setError("You've made too many requests. Please wait a moment and try again.");
      } else {
        setError("Something went wrong while analyzing your image. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

       <div>

         {/* Upload Card */}
        <div className="card shadow-sm w-100 " style={{ maxWidth: "100%" }}>
          <div className="card-body">
            <h4 className="mb-3 fw-semibold">Upload an Outfit Image</h4>

            <div
              {...getRootProps()}
              className={`border rounded p-4 mb-3 text-center ${
                isDragActive ? "border-dark bg-light" : "border-secondary"
              }`}
              style={{ cursor: "pointer" }}
            >
              <input {...getInputProps()} />
              <p className="mb-1 fs-6 fw-semibold">
                {isDragActive
                  ? "Drop the image here to upload"
                  : "Drag & drop an image here, or click to browse"}
              </p>
              <p className="text-muted mb-0">PNG, JPG, JPEG, or GIF</p>
              {image && (
                <p className="mt-2 mb-0 small text-truncate">
                  Selected file: {image.name}
                </p>
              )}
            </div>

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
              {loading ? "Analyzing..." : "Find Alternatives"}
            </button>

            {error && (
              <div className="alert alert-warning mt-3 mb-0" role="alert">
                {error}
              </div>
            )}
          </div>
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

     

     
      </div>

      <div>
         {/* ✅ Results + Cheapest Sidebar Row */}
        {results && (
          <div className="row mt-5">
          
             {/* LEFT COLUMN: RESULTS */}
            <div className="col-12 col-lg-9 mb-4 mb-lg-0">
              <ResultsGrid results={results} />
            </div>

            {/* RIGHT COLUMN: CHEAPEST SIDEBAR */}
            <div className="col-12 col-lg-3">
              <div  style={{ top: "1rem" }}>
                <CheapestSidebar results={results} />
              </div>
            </div>
          </div>
        )}
      </div>



    </div>
   





  );
}
