"use client";

import { type Language, type User, userApi, userKeys } from "@/entities/user";
import type { Locale } from "@/i18n/dictionaries";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface UseLanguagePreferenceOptions {
	savedMessage: string;
	errorMessage: string;
}

/** Map between app `Locale` segment (`che`) and stored preference (`ce`). */
const prefToLocale = (pref: Language): Locale => (pref === "ce" ? "che" : pref);
const localeToPref = (lang: Locale): Language => (lang === "che" ? "ce" : lang);

export const useLanguagePreference = (
	user: User,
	currentLang: Locale,
	{ savedMessage, errorMessage }: UseLanguagePreferenceOptions,
) => {
	const router = useRouter();
	const pathname = usePathname();
	const qc = useQueryClient();
	const [isPending, setIsPending] = useState(false);

	const value: Language = user.prefLanguage ?? localeToPref(currentLang);

	const setValue = async (next: Language) => {
		if (next === value && prefToLocale(next) === currentLang) return;
		setIsPending(true);

		const previous = value;
		qc.setQueryData<User>(userKeys.me(), prev =>
			prev ? { ...prev, prefLanguage: next } : prev,
		);

		try {
			await userApi.updatePreferences({ prefLanguage: next });
			toast.success(savedMessage);

			const nextLocale = prefToLocale(next);
			const segments = pathname.split("/");
			segments[1] = nextLocale;
			router.push(segments.join("/"));
			router.refresh();
		} catch {
			qc.setQueryData<User>(userKeys.me(), prev =>
				prev ? { ...prev, prefLanguage: previous } : prev,
			);
			toast.error(errorMessage);
		} finally {
			setIsPending(false);
		}
	};

	return { value, setValue, isPending };
};
