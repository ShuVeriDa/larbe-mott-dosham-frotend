"use client";

import {
	type UpdatePreferencesDto,
	type User,
	userKeys,
	useUpdatePreferences,
} from "@/entities/user";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type PreferenceKey = keyof UpdatePreferencesDto;

interface UsePreferenceOptions {
	savedMessage: string;
	errorMessage: string;
}

export const usePreference = <K extends PreferenceKey>(
	user: User,
	key: K,
	{ savedMessage, errorMessage }: UsePreferenceOptions,
) => {
	const qc = useQueryClient();
	const { mutateAsync, isPending } = useUpdatePreferences();
	const value = user[key] as UpdatePreferencesDto[K];

	const setValue = async (next: UpdatePreferencesDto[K]) => {
		const previous = value;

		qc.setQueryData<User>(userKeys.me(), prev =>
			prev ? { ...prev, [key]: next } : prev,
		);

		try {
			await mutateAsync({ [key]: next } as UpdatePreferencesDto);
			toast.success(savedMessage);
		} catch {
			qc.setQueryData<User>(userKeys.me(), prev =>
				prev ? { ...prev, [key]: previous } : prev,
			);
			toast.error(errorMessage);
		}
	};

	return { value, setValue, isPending };
};
