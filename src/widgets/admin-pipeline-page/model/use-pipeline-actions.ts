"use client";

import {
	type PipelineResetResult,
	type PipelineRollbackResult,
	type PipelineRunResult,
	useResetPipeline,
	useRollbackPipeline,
	useRunImprove,
	useRunLoad,
	useRunParse,
	useRunUnifyStep,
} from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export type PipelineActionKind =
	| "parse"
	| "unify"
	| "load"
	| "improve"
	| "rollback"
	| "reset";

export type ParseResult =
	| { ok: true; data: PipelineRunResult; slug: string | null }
	| { ok: false; message: string };
export type UnifyResult =
	| { ok: true; data: PipelineRunResult; slug: string }
	| { ok: false; message: string };
export type LoadResult =
	| { ok: true; data: PipelineRunResult }
	| { ok: false; message: string };
export type ImproveResult =
	| { ok: true; data: PipelineRunResult }
	| { ok: false; message: string };
export type RollbackResult =
	| { ok: true; data: PipelineRollbackResult; step: number }
	| { ok: false; message: string };
export type ResetResult =
	| { ok: true; data: PipelineResetResult }
	| { ok: false; message: string };

export interface PipelineResults {
	parse?: ParseResult;
	unify?: UnifyResult;
	load?: LoadResult;
	improve?: ImproveResult;
	rollback?: RollbackResult;
	reset?: ResetResult;
}

interface PendingConfirm {
	kind: Exclude<PipelineActionKind, "parse" | "unify">;
	title: string;
	text: string;
	confirm: string;
	cancel: string;
	tone: "warning" | "danger";
	step?: number;
}

interface UsePipelineActionsOptions {
	dict: Dictionary["admin"]["pipeline"];
}

export const usePipelineActions = ({ dict }: UsePipelineActionsOptions) => {
	const parse = useRunParse();
	const unify = useRunUnifyStep();
	const load = useRunLoad();
	const improve = useRunImprove();
	const rollback = useRollbackPipeline();
	const reset = useResetPipeline();

	const [results, setResults] = useState<PipelineResults>({});
	const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(
		null,
	);
	const [selectedRollbackStep, setSelectedRollbackStep] = useState<number | null>(
		null,
	);

	const reportError = useCallback(
		(kind: PipelineActionKind, err: unknown) => {
			const message = err instanceof Error ? err.message : String(err);
			setResults((prev) => ({ ...prev, [kind]: { ok: false, message } }));
			toast.error(dict.toasts.genericError);
		},
		[dict.toasts.genericError],
	);

	const runParse = useCallback(
		async (slug: string | null) => {
			try {
				const data = await parse.mutateAsync({ slug: slug ?? undefined });
				setResults((prev) => ({
					...prev,
					parse: { ok: true, data, slug },
				}));
				toast.success(dict.toasts.parseOk);
			} catch (err) {
				reportError("parse", err);
			}
		},
		[dict.toasts.parseOk, parse, reportError],
	);

	const runUnify = useCallback(
		async (slug: string) => {
			try {
				const data = await unify.mutateAsync({ slug });
				setResults((prev) => ({
					...prev,
					unify: { ok: true, data, slug },
				}));
				toast.success(dict.toasts.unifyOk);
			} catch (err) {
				reportError("unify", err);
			}
		},
		[dict.toasts.unifyOk, reportError, unify],
	);

	const confirmLoad = useCallback(
		(entriesCount: number) => {
			setPendingConfirm({
				kind: "load",
				title: dict.confirm.load.title,
				text: dict.confirm.load.text.replace(
					"{count}",
					new Intl.NumberFormat("ru-RU").format(entriesCount),
				),
				confirm: dict.confirm.load.confirm,
				cancel: dict.confirm.cancel,
				tone: "warning",
			});
		},
		[dict.confirm.cancel, dict.confirm.load],
	);

	const confirmImprove = useCallback(() => {
		setPendingConfirm({
			kind: "improve",
			title: dict.confirm.improve.title,
			text: dict.confirm.improve.text,
			confirm: dict.confirm.improve.confirm,
			cancel: dict.confirm.cancel,
			tone: "warning",
		});
	}, [dict.confirm.cancel, dict.confirm.improve]);

	const confirmRollback = useCallback(
		(step: number, label: string) => {
			setPendingConfirm({
				kind: "rollback",
				title: dict.confirm.rollback.title,
				text: dict.confirm.rollback.text.replace("{label}", label),
				confirm: dict.confirm.rollback.confirm,
				cancel: dict.confirm.cancel,
				tone: "warning",
				step,
			});
		},
		[dict.confirm.cancel, dict.confirm.rollback],
	);

	const confirmReset = useCallback(() => {
		setPendingConfirm({
			kind: "reset",
			title: dict.confirm.reset.title,
			text: dict.confirm.reset.text,
			confirm: dict.confirm.reset.confirm,
			cancel: dict.confirm.cancel,
			tone: "danger",
		});
	}, [dict.confirm.cancel, dict.confirm.reset]);

	const cancel = useCallback(() => {
		setPendingConfirm(null);
	}, []);

	const proceed = useCallback(async () => {
		const confirm = pendingConfirm;
		if (!confirm) return;
		setPendingConfirm(null);
		if (confirm.kind === "load") {
			try {
				const data = await load.mutateAsync();
				setResults((prev) => ({ ...prev, load: { ok: true, data } }));
				toast.success(dict.toasts.loadOk);
			} catch (err) {
				reportError("load", err);
			}
			return;
		}
		if (confirm.kind === "improve") {
			try {
				const data = await improve.mutateAsync();
				setResults((prev) => ({ ...prev, improve: { ok: true, data } }));
				toast.success(dict.toasts.improveOk);
			} catch (err) {
				reportError("improve", err);
			}
			return;
		}
		if (confirm.kind === "rollback" && confirm.step !== undefined) {
			const step = confirm.step;
			try {
				const data = await rollback.mutateAsync({ step });
				setResults((prev) => ({
					...prev,
					rollback: { ok: true, data, step },
				}));
				toast.success(dict.toasts.rollbackOk);
			} catch (err) {
				reportError("rollback", err);
			}
			return;
		}
		if (confirm.kind === "reset") {
			try {
				const data = await reset.mutateAsync();
				setResults((prev) => ({ ...prev, reset: { ok: true, data } }));
				toast.success(dict.toasts.resetOk);
			} catch (err) {
				reportError("reset", err);
			}
		}
	}, [
		dict.toasts.improveOk,
		dict.toasts.loadOk,
		dict.toasts.resetOk,
		dict.toasts.rollbackOk,
		improve,
		load,
		pendingConfirm,
		reportError,
		reset,
		rollback,
	]);

	const isRunning =
		parse.isPending ||
		unify.isPending ||
		load.isPending ||
		improve.isPending ||
		rollback.isPending ||
		reset.isPending;

	return {
		runParse,
		runUnify,
		confirmLoad,
		confirmImprove,
		confirmRollback,
		confirmReset,
		cancel,
		proceed,
		pendingConfirm,
		results,
		selectedRollbackStep,
		setSelectedRollbackStep,
		pending: {
			parse: parse.isPending,
			unify: unify.isPending,
			load: load.isPending,
			improve: improve.isPending,
			rollback: rollback.isPending,
			reset: reset.isPending,
		},
		isRunning,
	};
};

export type UsePipelineActions = ReturnType<typeof usePipelineActions>;
