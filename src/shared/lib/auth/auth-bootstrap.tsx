"use client";

import { userKeys } from "@/entities/user";
import { apiClient, refreshAccessToken } from "@/shared/api";
import { useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useEffect, useRef } from "react";
import { useAuthStore } from "./auth-store";

/**
 * Restores the authenticated session on app start by exchanging the
 * httpOnly refresh-token cookie for a fresh access token, then prefetches
 * the current user. Runs once per mount; interceptor-level refresh is
 * deduplicated via a shared promise.
 */
export const AuthBootstrap = ({ children }: { children: ReactNode }) => {
	const qc = useQueryClient();
	const started = useRef(false);

	useEffect(() => {
		if (started.current) return;
		started.current = true;

		const run = async () => {
			const token = await refreshAccessToken();
			if (!token) {
				useAuthStore.getState().setStatus("ready");
				return;
			}

			try {
				const { data: user } = await apiClient.get("/auth/me");
				qc.setQueryData(userKeys.me(), user);
			} catch {
				useAuthStore.getState().setAccessToken(null);
			} finally {
				useAuthStore.getState().setStatus("ready");
			}
		};

		void run();
	}, [qc]);

	return <>{children}</>;
};
