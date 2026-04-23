"use client";

import { useCurrentUser } from "@/entities/user";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

/**
 * When the authenticated user loads, apply their stored `prefTheme` to
 * next-themes — but only once per session, so the user can still flip the
 * theme locally without being overridden on every refetch.
 */
export const useThemeSync = () => {
	const { data: user } = useCurrentUser();
	const { setTheme, theme } = useTheme();
	const appliedRef = useRef(false);

	useEffect(() => {
		if (appliedRef.current) return;
		if (!user?.prefTheme) return;
		if (user.prefTheme !== theme) {
			setTheme(user.prefTheme);
		}
		appliedRef.current = true;
	}, [user?.prefTheme, setTheme, theme]);
};
