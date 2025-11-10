import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


export async function uploadImage(formData) {
  const response = await axios.post(`${API_URL}/api/outfit_searches/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: false,
  });
  return response.data;
}
