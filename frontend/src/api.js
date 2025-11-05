import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function uploadImage(formData) {
  console.log("Uploading image to:", API_URL);
  const response = await axios.post(`${base}/api/outfit_searches/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}
