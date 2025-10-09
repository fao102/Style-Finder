import React from "react";
import ImageUploader from "./components/imageUploader";

export default function App() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginTop: "2rem" }}>👗 Style Finder</h1>
      <ImageUploader />
    </div>
  );
}
