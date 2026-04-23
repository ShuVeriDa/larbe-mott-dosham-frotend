"use client";

import { useCurrentUser, type Language } from "@/entities/user";
import type { Locale } from "@/i18n/dictionaries";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const prefToLocale = (pref: Language): Locale => (pref === "ce" ? "che" : pref);

/**
 * After login, if the URL locale doesn't match `user.prefLanguage`, replace
 * the route with the preferred locale. Runs once per session — the user can
 * still switch locale via the UI afterwards without being fought over.
 */
export const useLanguageSync = (currentLang: Locale) => {
	const { data: user } = useCurrentUser();
	const router = useRouter();
	const pathname = usePathname();
	const appliedRef = useRef(false);

	useEffect(() => {
		if (appliedRef.current) return;
		if (!user?.prefLanguage) return;

		const preferredLocale = prefToLocale(user.prefLanguage);
		appliedRef.current = true;

		if (preferredLocale === currentLang) return;

		const segments = pathname.split("/");
		segments[1] = preferredLocale;
		router.replace(segments.join("/"));
	}, [user?.prefLanguage, currentLang, pathname, router]);
};
