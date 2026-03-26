import axios from "axios";

const api = axios.create({
  baseURL: "",
  withCredentials: true,
  validateStatus: () => true,
});
// const api = axios.create({
//   baseURL: "http://localhost:5000",
//   withCredentials: true,
//   validateStatus: () => true,
// });

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
export async function logout() {
  try {
    const res = await api.post("/api/auth/logout");
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
