"use client";

import {
	type PipelineRunResult,
	usePipelineFullStatus,
	usePipelineParsedFiles,
	useRunParse,
} from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface PendingConfirm {
	slug: string | null;
	text: string;
}

export type ParseResult =
	| { ok: true; slug: string | null; data: PipelineRunResult | PipelineRunResult[] }
	| { ok: false; slug: string | null; message: string };

interface UseParsePageOptions {
	dict: Dictionary["admin"]["pipelineParse"];
}

export const useParsePage = ({ dict }: UseParsePageOptions) => {
	const statusQuery = usePipelineFullStatus();
	const parsedFilesQuery = usePipelineParsedFiles();
	const runParse = useRunParse();

	const [selectedSlug, setSelectedSlug] = useState<string>("");
	const [pending, setPending] = useState<PendingConfirm | null>(null);
	const [result, setResult] = useState<ParseResult | null>(null);
	const [runningSlug, setRunningSlug] = useState<string | null>(null);

	const dictionaries = statusQuery.data?.parsed?.bySlug ?? [];

	const stats = useMemo(() => {
		const total = dictionaries.length;
		const parsed = dictionaries.filter(
			(d) => d.status === "parsed" || d.status === "merged",
		).length;
		const pendingSlugs = dictionaries
			.filter((d) => d.status === "pending")
			.map((d) => d.slug);
		return { total, parsed, pending: pendingSlugs };
	}, [dictionaries]);

	const openConfirm = useCallback(
		(slug: string | null) => {
			const text =
				slug === null
					? dict.confirm.textAll
					: dict.confirm.textOne.replace("{slug}", slug);
			setPending({ slug, text });
		},
		[dict.confirm.textAll, dict.confirm.textOne],
	);

	const closeConfirm = useCallback(() => setPending(null), []);

	const proceed = useCallback(async () => {
		if (!pending) return;
		const slug = pending.slug;
		setPending(null);
		setResult(null);
		setRunningSlug(slug);
		try {
			const data = await runParse.mutateAsync({
				slug: slug ?? undefined,
			});
			setResult({ ok: true, slug, data });
			toast.success(
				slug === null
					? dict.toasts.parseAllOk
					: dict.toasts.parseOk.replace("{slug}", slug),
			);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			setResult({ ok: false, slug, message });
			toast.error(dict.toasts.parseErr.replace("{slug}", slug ?? "all"));
		} finally {
			setRunningSlug(null);
		}
	}, [dict.toasts, pending, runParse]);

	return {
		statusQuery,
		parsedFilesQuery,
		dictionaries,
		stats,
		selectedSlug,
		setSelectedSlug,
		pending,
		openConfirm,
		closeConfirm,
		proceed,
		result,
		isRunning: runParse.isPending,
		runningSlug,
	};
};

export type UseParsePage = ReturnType<typeof useParsePage>;
