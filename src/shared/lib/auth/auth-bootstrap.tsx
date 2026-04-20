"use client";

import { type User, userKeys } from "@/entities/user";
import { refreshAccessToken } from "@/shared/api";
import { useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useEffect, useRef } from "react";
import { useAuthStore } from "./auth-store";

/**
 * Restores the authenticated session on app start by exchanging the
 * httpOnly refresh-token cookie for a fresh access token. The refresh
 * endpoint also returns the current user, which we seed into the React
 * Query cache so `useCurrentUser` doesn't need to refetch.
 */
export const AuthBootstrap = ({ children }: { children: ReactNode }) => {
	const qc = useQueryClient();
	const started = useRef(false);

	useEffect(() => {
		if (started.current) return;
		started.current = true;

		const run = async () => {
			const result = await refreshAccessToken();
			if (result) {
				qc.setQueryData(userKeys.me(), result.user as unknown as User);
			}
			useAuthStore.getState().setStatus("ready");
		};

		void run();
	}, [qc]);

	return <>{children}</>;
};
