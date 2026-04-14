"use client";

import { API_URL } from "@/shared/config";
import axios from "axios";
import { toApiError } from "./error";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send refresh-token cookie automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------------------------------------
// Request interceptor — attach access token from memory
// ---------------------------------------------------------------------------

apiClient.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? window.__accessToken ?? null
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ---------------------------------------------------------------------------
// Response interceptor — normalise errors; handle 401 with token refresh
// ---------------------------------------------------------------------------

let refreshPromise: Promise<string | null> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Only one concurrent refresh at a time
      if (!refreshPromise) {
        refreshPromise = apiClient
          .post<{ accessToken: string }>("/auth/login/access-token")
          .then((res) => {
            const token = res.data.accessToken;
            if (typeof window !== "undefined") {
              window.__accessToken = token;
            }
            return token;
          })
          .catch(() => {
            if (typeof window !== "undefined") {
              window.__accessToken = null;
            }
            return null;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newToken = await refreshPromise;

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(toApiError(error));
  },
);

// ---------------------------------------------------------------------------
// Module augmentation — store token in window without extra dependencies
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    __accessToken?: string | null;
  }
}

export function setAccessToken(token: string | null): void {
  if (typeof window !== "undefined") {
    window.__accessToken = token;
  }
}

export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return window.__accessToken ?? null;
  }
  return null;
}
