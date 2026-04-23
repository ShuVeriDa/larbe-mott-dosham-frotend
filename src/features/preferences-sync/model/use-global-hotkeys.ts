"use client";

import { useCurrentUser } from "@/entities/user";
import type { Locale } from "@/i18n/dictionaries";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const isEditable = (el: EventTarget | null) => {
	if (!(el instanceof HTMLElement)) return false;
	const tag = el.tagName;
	return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
};

/**
 * Global shortcuts (gated by `prefHotkeys`):
 *   Ctrl/Cmd+K — navigate to /search
 *   Ctrl/Cmd+R — navigate to /random (skipped on /random, where the page
 *                owns its own Ctrl+R shuffle binding)
 *
 * Unauthenticated users get the defaults (enabled) since the feature is
 * useful regardless of account state.
 */
export const useGlobalHotkeys = (lang: Locale) => {
	const { data: user } = useCurrentUser();
	const router = useRouter();
	const pathname = usePathname();

	const enabled = user?.prefHotkeys ?? true;

	useEffect(() => {
		if (!enabled) return;

		const onKey = (e: KeyboardEvent) => {
			if (isEditable(e.target)) return;
			const mod = e.ctrlKey || e.metaKey;
			if (!mod) return;
			const key = e.key.toLowerCase();

			if (key === "k") {
				e.preventDefault();
				router.push(`/${lang}/search`);
				return;
			}
			if (key === "r" && pathname !== `/${lang}/random`) {
				e.preventDefault();
				router.push(`/${lang}/random`);
			}
		};

		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [enabled, router, lang, pathname]);
};
