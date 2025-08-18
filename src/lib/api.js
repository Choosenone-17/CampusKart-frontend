import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: false,
});

// --- Session ID utility ---
export function getSessionId() {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID(); // generate unique ID
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
}

// --- Cart API ---
export async function fetchCart() {
  const sessionId = getSessionId();
  const res = await api.get(`/api/cart/${sessionId}`);
  return res.data;
}

export async function addToCart(productId) {
  const sessionId = getSessionId();
  const res = await api.post(`/api/cart/${sessionId}`, { productId });
  return res.data;
}

export async function removeFromCart(productId) {
  const sessionId = getSessionId();
  const res = await api.delete(`/api/cart/${sessionId}/${productId}`);
  return res.data;
}

// --- Export api for other requests ---
export default api;
