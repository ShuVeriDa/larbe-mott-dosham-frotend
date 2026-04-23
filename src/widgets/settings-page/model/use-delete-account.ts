"use client";

import { useDeleteAccount } from "@/entities/user";
import { useLogout } from "@/features/auth";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { setAccessToken } from "@/shared/api";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UseDeleteAccountFlowParams {
	lang: Locale;
	confirmPhrase: string;
	dict: Dictionary["profile"]["delete"];
}

export const useDeleteAccountFlow = ({
	lang,
	confirmPhrase,
	dict,
}: UseDeleteAccountFlowParams) => {
	const router = useRouter();
	const qc = useQueryClient();
	const deleteMutation = useDeleteAccount();
	const logout = useLogout();

	const submit = async () => {
		try {
			await deleteMutation.mutateAsync({ confirmation: confirmPhrase });
			toast.success(dict.success);
			try {
				await logout.mutateAsync();
			} catch {
				setAccessToken(null);
			}
			qc.clear();
			router.replace(`/${lang}`);
			router.refresh();
		} catch {
			toast.error(dict.error);
		}
	};

	return { submit, isPending: deleteMutation.isPending };
};
