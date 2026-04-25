"use client";

import {
	type PipelineRunResult,
	useRunLoad,
} from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { ApiError } from "@/shared/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Args {
	dict: Dictionary["admin"]["pipelineLoad"];
	totalInUnified: number | null;
}

const getErrorMessage = (err: unknown): string => {
	if (err instanceof ApiError) return err.message;
	if (err instanceof Error) return err.message;
	return String(err);
};

export const useLoadActions = ({ dict, totalInUnified }: Args) => {
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [progress, setProgress] = useState(0);
	const [stepIndex, setStepIndex] = useState(0);
	const [lastResult, setLastResult] = useState<PipelineRunResult | null>(null);
	const [lastError, setLastError] = useState<string | null>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const runLoad = useRunLoad();
	const isRunning = runLoad.isPending;

	useEffect(() => {
		if (!isRunning) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			return;
		}
		setProgress(0);
		setStepIndex(0);
		const totalSteps = dict.progress.steps.length;
		intervalRef.current = setInterval(() => {
			setProgress((prev) => {
				const next = Math.min(prev + Math.random() * 8 + 2, 95);
				const step = Math.min(
					Math.floor(next / (95 / Math.max(totalSteps, 1))),
					totalSteps - 1,
				);
				setStepIndex(step);
				return next;
			});
		}, 400);
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [isRunning, dict.progress.steps.length]);

	const askLoad = useCallback(() => setConfirmOpen(true), []);
	const cancel = useCallback(() => setConfirmOpen(false), []);

	const proceed = useCallback(async () => {
		setConfirmOpen(false);
		setLastResult(null);
		setLastError(null);
		toast.info(dict.toast.started);
		try {
			const res = await runLoad.mutateAsync();
			setProgress(100);
			setStepIndex(dict.progress.steps.length - 1);
			setLastResult(res);
			toast.success(
				dict.toast.success.replace("{loaded}", String(res.loaded ?? 0)),
			);
		} catch (err) {
			const message = getErrorMessage(err);
			setLastError(message);
			toast.error(dict.toast.error.replace("{message}", message));
		}
	}, [dict, runLoad]);

	const confirmBody = totalInUnified
		? dict.confirm.body.replace(
				"{count}",
				new Intl.NumberFormat("ru-RU").format(totalInUnified),
			)
		: dict.confirm.bodyNoCount;

	return {
		isRunning,
		progress,
		stepIndex,
		lastResult,
		lastError,
		confirmOpen,
		confirmBody,
		askLoad,
		cancel,
		proceed,
		canRun: totalInUnified !== null && totalInUnified > 0,
	};
};

export type LoadActions = ReturnType<typeof useLoadActions>;
