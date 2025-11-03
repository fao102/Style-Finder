import React, { useState } from "react";
import { uploadImage } from "../api";
import ResultsGrid from "./resultsGrid";
import CheapestSidebar from "./CheapestSidebar";

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
    <div>

       <div>

         {/* Upload Card */}
        <div className="card shadow-sm w-100 " style={{ maxWidth: "100%" }}>
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
              {loading ? "Analyzing..." : "Find Alternatives"}
            </button>
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
