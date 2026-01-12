import axios from "axios";
import { refreshToken } from "./Refresh";
import type { ApiError } from "../types/api.types";

interface CustomRequestConfig {
  _retry?: boolean;
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  data?: unknown;
  params?: Record<string, string | number | boolean>;
  [key: string]: unknown;
}

// Création de l'instance Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Gestion du rafraîchissement du token
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string): void => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// Intercepteur de requête pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs et le rafraîchissement du token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustomRequestConfig = error.config || {};

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            if (originalRequest.url) {
              resolve(api({
                url: originalRequest.url,
                method: originalRequest.method || 'GET',
                data: originalRequest.data,
                params: originalRequest.params,
                headers: originalRequest.headers
              }));
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          localStorage.setItem("access_token", newAccessToken);
          onRefreshed(newAccessToken);
          
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          if (originalRequest.url) {
            return api({
              url: originalRequest.url,
              method: originalRequest.method || 'GET',
              data: originalRequest.data,
              params: originalRequest.params,
              headers: originalRequest.headers
            });
          }
        }
      } catch (refreshError) {
        // En cas d'erreur de rafraîchissement, déconnecter l'utilisateur
        localStorage.removeItem("access_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Gestion des autres erreurs
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message,
      status: error.response?.status || 500,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(apiError);
  }
);

export default api;
