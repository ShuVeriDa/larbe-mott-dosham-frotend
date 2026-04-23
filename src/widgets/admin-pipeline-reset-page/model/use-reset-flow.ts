"use client";

import {
	type ResetResult,
	useResetPipeline,
} from "@/features/admin-pipeline-reset";
import type { Dictionary } from "@/i18n/dictionaries";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface UseResetFlowOptions {
	dict: Dictionary["admin"]["pipelineReset"];
	expectedPhrase: string;
}

export const useResetFlow = ({ dict, expectedPhrase }: UseResetFlowOptions) => {
	const [phrase, setPhrase] = useState("");
	const [modalOpen, setModalOpen] = useState(false);
	const [result, setResult] = useState<ResetResult | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const resetMutation = useResetPipeline();

	const canSubmit = useMemo(
		() => phrase === expectedPhrase,
		[expectedPhrase, phrase],
	);

	const openModal = useCallback(() => {
		if (!canSubmit) return;
		setErrorMessage(null);
		setModalOpen(true);
	}, [canSubmit]);

	const closeModal = useCallback(() => {
		if (resetMutation.isPending) return;
		setModalOpen(false);
	}, [resetMutation.isPending]);

	const execute = useCallback(async () => {
		setErrorMessage(null);
		try {
			const data = await resetMutation.mutateAsync();
			setResult(data);
			setPhrase("");
			setModalOpen(false);
			toast.success(dict.toasts.success);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : dict.toasts.error;
			setErrorMessage(message);
			toast.error(dict.toasts.error);
		}
	}, [dict.toasts.error, dict.toasts.success, resetMutation]);

	return {
		phrase,
		setPhrase,
		canSubmit,
		modalOpen,
		openModal,
		closeModal,
		execute,
		isPending: resetMutation.isPending,
		result,
		errorMessage,
	};
};

export type UseResetFlowResult = ReturnType<typeof useResetFlow>;
