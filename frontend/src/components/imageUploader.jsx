import React, { useState } from "react";
import axios from "axios";

export default function ImageUploader() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setMessage("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setUploading(true);
      setMessage("");

      const response = await axios.post(
        import.meta.env.VITE_API_URL,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Upload success:", response.data);
      setMessage("✅ Image uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage("❌ Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Upload an Outfit</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ margin: "1rem 0" }}
      />

      {preview && (
        <div>
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "250px",
              height: "auto",
              borderRadius: "12px",
              marginBottom: "1rem",
            }}
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          backgroundColor: uploading ? "#ccc" : "#007bff",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "6px",
          cursor: uploading ? "not-allowed" : "pointer",
        }}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {message && (
        <p style={{ marginTop: "1rem", fontWeight: "500" }}>{message}</p>
      )}
    </div>
  );
}
