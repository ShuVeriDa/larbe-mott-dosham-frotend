"use client";

import { type User, userKeys, useUpdatePreferences } from "@/entities/user";
import type { UpdatePreferencesDto } from "@/entities/user";
import type { Dictionary } from "@/i18n/dictionaries";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type BooleanPref = "prefSaveHistory" | "prefShowExamples" | "prefCompactView";

export const useBooleanPreference = (
	user: User,
	key: BooleanPref,
	errorMessage: Dictionary["profile"]["settings"]["updateError"],
) => {
	const qc = useQueryClient();
	const { mutateAsync, isPending } = useUpdatePreferences();
	const value = user[key] as boolean;

	const toggle = async () => {
		const next = !value;
		// Optimistic update
		qc.setQueryData<User>(userKeys.me(), prev =>
			prev ? { ...prev, [key]: next } : prev,
		);

		try {
			await mutateAsync({ [key]: next } as UpdatePreferencesDto);
		} catch {
			// Rollback
			qc.setQueryData<User>(userKeys.me(), prev =>
				prev ? { ...prev, [key]: value } : prev,
			);
			toast.error(errorMessage);
		}
	};

	return { value, toggle, isPending };
};
