"use client";

import {
	type ImproveResult,
	useRunImprove,
} from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Dict = Dictionary["admin"]["pipelineImprove"];

export type RunnerPhase = "idle" | "confirm" | "running" | "done" | "error";

interface UseImproveRunnerOptions {
	dict: Dict;
	totalEntries: number | undefined;
}

const STEP_KEYS: Array<keyof Dict["progress"]["steps"]> = [
	"normalizeStyles",
	"fixExamples",
	"removeEmpty",
	"normalizeWords",
	"dedupMeanings",
	"trimLong",
];

export const useImproveRunner = ({
	dict,
	totalEntries,
}: UseImproveRunnerOptions) => {
	const mutation = useRunImprove();
	const [phase, setPhase] = useState<RunnerPhase>("idle");
	const [progress, setProgress] = useState(0);
	const [stepLabel, setStepLabel] = useState<string>(dict.progress.running);
	const [result, setResult] = useState<ImproveResult | null>(null);
	const [error, setError] = useState<string | null>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clearTimers = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		if (hideTimeoutRef.current) {
			clearTimeout(hideTimeoutRef.current);
			hideTimeoutRef.current = null;
		}
	}, []);

	useEffect(() => clearTimers, [clearTimers]);

	const openConfirm = useCallback(() => {
		setPhase("confirm");
	}, []);

	const cancelConfirm = useCallback(() => {
		setPhase((prev) => (prev === "confirm" ? "idle" : prev));
	}, []);

	const startSimulatedProgress = useCallback(() => {
		setProgress(0);
		let pct = 0;
		let stepIdx = 0;
		setStepLabel(dict.progress.running);
		intervalRef.current = setInterval(() => {
			pct += Math.random() * 10 + 3;
			if (pct > 95) pct = 95;
			setProgress(pct);
			if (pct > stepIdx * 16 + 10 && stepIdx < STEP_KEYS.length) {
				const key = STEP_KEYS[stepIdx];
				setStepLabel(dict.progress.steps[key]);
				stepIdx++;
			}
		}, 350);
	}, [dict.progress.running, dict.progress.steps]);

	const confirmRun = useCallback(async () => {
		setPhase("running");
		setError(null);
		setResult(null);
		startSimulatedProgress();
		try {
			const data = await mutation.mutateAsync();
			clearTimers();
			setProgress(100);
			setStepLabel(dict.progress.done);
			setResult(data);
			setPhase("done");
			toast.success(
				dict.toasts.success.replace("{cleaned}", String(data.cleaned)),
			);
			hideTimeoutRef.current = setTimeout(() => {
				setPhase((prev) => (prev === "done" ? "idle" : prev));
			}, 6000);
		} catch (err) {
			clearTimers();
			const message = err instanceof Error ? err.message : String(err);
			setError(message);
			setPhase("error");
			toast.error(dict.toasts.error.replace("{message}", message));
		}
	}, [
		clearTimers,
		dict.progress.done,
		dict.toasts.error,
		dict.toasts.success,
		mutation,
		startSimulatedProgress,
	]);

	return {
		phase,
		progress,
		stepLabel,
		result,
		error,
		totalEntries,
		isPending: mutation.isPending,
		openConfirm,
		cancelConfirm,
		confirmRun,
	};
};

export type ImproveRunner = ReturnType<typeof useImproveRunner>;
