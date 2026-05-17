import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function uploadImage(formData, token = null) {
  const headers = { "Content-Type": "multipart/form-data" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const response = await axios.post(`${API_URL}/api/outfit_searches/`, formData, {
    headers,
    withCredentials: false,
  });
  return response.data;
}

export async function fetchHistory(token) {
  const response = await axios.get(`${API_URL}/api/outfit_searches/history/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
