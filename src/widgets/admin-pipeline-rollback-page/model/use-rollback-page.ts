"use client";

import {
	type MergeLogEntry,
	type PipelineResetResult,
	type PipelineRollbackResult,
	useResetPipeline,
	useRollbackPipeline,
} from "@/features/admin-pipeline";
import { useCallback, useMemo, useState } from "react";

export type ConfirmKind =
	| { kind: "rollback"; step: number; entry: MergeLogEntry }
	| { kind: "reset" };

export type ResultKind =
	| { kind: "rollback"; payload: PipelineRollbackResult; label: string }
	| { kind: "reset"; payload: PipelineResetResult }
	| { kind: "error"; message: string }
	| null;

interface UseRollbackPageArgs {
	steps: MergeLogEntry[];
}

export const useRollbackPage = ({ steps }: UseRollbackPageArgs) => {
	const [selectedStep, setSelectedStep] = useState<number | null>(null);
	const [confirm, setConfirm] = useState<ConfirmKind | null>(null);
	const [result, setResult] = useState<ResultKind>(null);

	const rollback = useRollbackPipeline();
	const reset = useResetPipeline();

	const selectedEntry = useMemo(
		() =>
			selectedStep != null
				? steps.find((s) => s.step === selectedStep) ?? null
				: null,
		[selectedStep, steps],
	);

	const selectStep = useCallback((step: number) => {
		setSelectedStep((prev) => (prev === step ? null : step));
	}, []);

	const clearSelection = useCallback(() => {
		setSelectedStep(null);
	}, []);

	const requestRollbackConfirm = useCallback(() => {
		if (!selectedEntry) return;
		setConfirm({
			kind: "rollback",
			step: selectedEntry.step,
			entry: selectedEntry,
		});
	}, [selectedEntry]);

	const requestResetConfirm = useCallback(() => {
		setConfirm({ kind: "reset" });
	}, []);

	const closeConfirm = useCallback(() => setConfirm(null), []);

	const executeRollback = useCallback(
		(entry: MergeLogEntry) => {
			rollback.mutate(
				{ step: entry.step },
				{
					onSuccess: (payload) => {
						setResult({ kind: "rollback", payload, label: entry.title });
						setSelectedStep(null);
					},
					onError: (err) => {
						setResult({
							kind: "error",
							message: err instanceof Error ? err.message : String(err),
						});
					},
				},
			);
			setConfirm(null);
		},
		[rollback],
	);

	const executeReset = useCallback(() => {
		reset.mutate(undefined, {
			onSuccess: (payload) => {
				setResult({ kind: "reset", payload });
				setSelectedStep(null);
			},
			onError: (err) => {
				setResult({
					kind: "error",
					message: err instanceof Error ? err.message : String(err),
				});
			},
		});
		setConfirm(null);
	}, [reset]);

	const dismissResult = useCallback(() => setResult(null), []);

	return {
		selectedStep,
		selectedEntry,
		confirm,
		result,
		isRollingBack: rollback.isPending,
		isResetting: reset.isPending,
		selectStep,
		clearSelection,
		requestRollbackConfirm,
		requestResetConfirm,
		closeConfirm,
		executeRollback,
		executeReset,
		dismissResult,
	};
};
