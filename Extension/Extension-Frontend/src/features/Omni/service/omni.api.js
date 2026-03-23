import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export async function processData(formData) {
  try {
    const res = await api.post("/api/omni/process-item", formData);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function saveData(formData) {
  try {
    const res = await api.post("/api/omni/save-data", formData);
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
    throw error.response?.data;
  }
}
