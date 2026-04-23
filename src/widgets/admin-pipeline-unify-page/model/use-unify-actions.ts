"use client";

import {
	useRollbackStep,
	useRunUnifyStep,
	type UnifyStepResponse,
} from "@/features/admin-pipeline-unify";
import type { Dictionary } from "@/i18n/dictionaries";
import { ApiError } from "@/shared/api";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseUnifyActionsArgs {
	dict: Dictionary["admin"]["pipelineUnify"];
}

type ConfirmState =
	| { kind: "unify"; slug: string }
	| { kind: "rollback"; step: number }
	| null;

const getErrorMessage = (err: unknown): string => {
	if (err instanceof ApiError) return err.message;
	if (err instanceof Error) return err.message;
	return String(err);
};

export const useUnifyActions = ({ dict }: UseUnifyActionsArgs) => {
	const [confirm, setConfirm] = useState<ConfirmState>(null);
	const [runningSlug, setRunningSlug] = useState<string | null>(null);
	const [rollingBack, setRollingBack] = useState<number | null>(null);
	const [lastResult, setLastResult] = useState<UnifyStepResponse | null>(null);
	const [lastError, setLastError] = useState<string | null>(null);

	const runUnify = useRunUnifyStep();
	const rollback = useRollbackStep();

	const askUnify = useCallback((slug: string) => {
		setConfirm({ kind: "unify", slug });
	}, []);

	const askRollback = useCallback((step: number) => {
		setConfirm({ kind: "rollback", step });
	}, []);

	const cancel = useCallback(() => setConfirm(null), []);

	const proceed = useCallback(async () => {
		if (!confirm) return;
		if (confirm.kind === "unify") {
			const slug = confirm.slug;
			setConfirm(null);
			setRunningSlug(slug);
			setLastResult(null);
			setLastError(null);
			toast.info(dict.toast.started.replace("{slug}", slug));
			try {
				const res = await runUnify.mutateAsync(slug);
				setLastResult(res);
				toast.success(dict.toast.success.replace("{slug}", slug));
			} catch (err) {
				const msg = getErrorMessage(err);
				setLastError(msg);
				toast.error(dict.toast.error.replace("{message}", msg));
			} finally {
				setRunningSlug(null);
			}
			return;
		}

		if (confirm.kind === "rollback") {
			const step = confirm.step;
			setConfirm(null);
			setRollingBack(step);
			try {
				await rollback.mutateAsync(step);
				toast.success(
					dict.toast.rollbackSuccess.replace("{step}", String(step)),
				);
			} catch (err) {
				const msg = getErrorMessage(err);
				toast.error(dict.toast.rollbackError.replace("{message}", msg));
			} finally {
				setRollingBack(null);
			}
		}
	}, [confirm, dict, runUnify, rollback]);

	const confirmLabels = confirm
		? confirm.kind === "unify"
			? {
					title: dict.confirm.title,
					body: dict.confirm.body.replace("{slug}", confirm.slug),
					confirm: dict.confirm.confirm,
					cancel: dict.confirm.cancel,
					tone: "primary" as const,
				}
			: {
					title: dict.rollbackConfirm.title.replace(
						"{step}",
						String(confirm.step),
					),
					body: dict.rollbackConfirm.body.replace(
						"{step}",
						String(confirm.step),
					),
					confirm: dict.rollbackConfirm.confirm,
					cancel: dict.rollbackConfirm.cancel,
					tone: "danger" as const,
				}
		: null;

	return {
		runningSlug,
		rollingBack,
		lastResult,
		lastError,
		askUnify,
		askRollback,
		proceed,
		cancel,
		confirmOpen: confirm !== null,
		confirmLabels,
		busy: runningSlug !== null || rollingBack !== null,
	};
};
