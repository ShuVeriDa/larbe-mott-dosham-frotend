"use client";

import { type Theme, type User } from "@/entities/user";
import { useTheme } from "next-themes";
import { usePreference } from "./use-preference";

interface UseThemePreferenceOptions {
	savedMessage: string;
	errorMessage: string;
}

export const useThemePreference = (
	user: User,
	options: UseThemePreferenceOptions,
) => {
	const { setTheme } = useTheme();
	const pref = usePreference(user, "prefTheme", options);

	const setValue = async (next: Theme) => {
		setTheme(next);
		await pref.setValue(next);
	};

	return { value: pref.value as Theme, setValue, isPending: pref.isPending };
};
