"use client";

import { API_URL } from "@/shared/config";
import { useAuthStore } from "@/shared/lib/auth";
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
// Request interceptor — attach access token from the auth store
// ---------------------------------------------------------------------------

apiClient.interceptors.request.use((config) => {
	const token = useAuthStore.getState().accessToken;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

// ---------------------------------------------------------------------------
// Shared refresh helper — deduplicates concurrent refresh attempts
// ---------------------------------------------------------------------------

let refreshPromise: Promise<string | null> | null = null;

export const refreshAccessToken = (): Promise<string | null> => {
	if (!refreshPromise) {
		refreshPromise = apiClient
			.post<{ accessToken: string }>("/auth/login/access-token")
			.then((res) => {
				const token = res.data.accessToken;
				useAuthStore.getState().setAccessToken(token);
				return token;
			})
			.catch(() => {
				useAuthStore.getState().setAccessToken(null);
				return null;
			})
			.finally(() => {
				refreshPromise = null;
			});
	}

	return refreshPromise;
};

// ---------------------------------------------------------------------------
// Response interceptor — normalise errors; handle 401 with token refresh
// ---------------------------------------------------------------------------

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config as typeof error.config & {
			_retry?: boolean;
			url?: string;
		};

		// Never try to refresh on the refresh endpoint itself — that would loop
		const isRefreshCall = originalRequest?.url?.includes(
			"/auth/login/access-token",
		);

		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!isRefreshCall
		) {
			originalRequest._retry = true;

			const newToken = await refreshAccessToken();

			if (newToken) {
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return apiClient(originalRequest);
			}
		}

		return Promise.reject(toApiError(error));
	},
);

// ---------------------------------------------------------------------------
// Public API — thin wrappers around the auth store
// ---------------------------------------------------------------------------

export const setAccessToken = (token: string | null): void => {
	useAuthStore.getState().setAccessToken(token);
};

export const getAccessToken = (): string | null =>
	useAuthStore.getState().accessToken;
