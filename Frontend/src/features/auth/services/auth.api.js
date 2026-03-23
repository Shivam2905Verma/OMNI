import axios from "axios";
const API_URL = import.meta.env.VITE_BACKEND_URL

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  validateStatus: () => true,
});

export async function login(user, password) {
  let identity = user.trim();
  try {
    const res = await api.post("/api/auth/login", { identity, password });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function register(email, username, password) {
  try {
    const res = await api.post("/api/auth/register", {
      email,
      username,
      password,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function get_me() {
  try {
    const res = await api.get("/api/auth/get-me");
    return res.data
  } catch (error) {
    throw error;
  }
}
