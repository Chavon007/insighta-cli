import axios from "axios";
import { getCredentials, saveCredentials, clearCredentials } from "./credentials.js";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "X-API-Version": "1",
  },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const credentials = getCredentials();
  if (credentials?.access_token) {
    config.headers.Authorization = `Bearer ${credentials.access_token}`;
  }
  return config;
});

// Auto refresh if token expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const credentials = getCredentials();

    if (error.response?.status === 401 && credentials?.refresh_token) {
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: credentials.refresh_token,
        });

        saveCredentials({
          ...credentials,
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });

        // Retry original request with new token
        error.config.headers.Authorization = `Bearer ${data.access_token}`;
        return axios(error.config);
      } catch {
        clearCredentials();
        console.error("Session expired. Please run: insighta login");
        process.exit(1);
      }
    }
    return Promise.reject(error);
  }
);

export default api;