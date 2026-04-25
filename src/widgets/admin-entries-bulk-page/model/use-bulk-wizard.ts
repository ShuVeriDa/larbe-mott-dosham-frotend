"use client";

import {
	type BulkUpdateResponse,
	useBatchFetchAdminEntries,
	useBulkFilterAdminEntries,
	useBulkFindProblems,
	useBulkUpdateAdminEntries,
} from "@/features/admin-entries";
import type { Dictionary } from "@/i18n/dictionaries";
import { ApiError } from "@/shared/api";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { BULK_MAX, parseIds } from "../lib/parse-ids";
import {
	type FieldOpDraft,
	buildPayload,
	buildPreviewRows,
	resolveOperations,
} from "../lib/build-payload";

export type Step = 1 | 2 | 3 | 4;
export type SelectionMethod = "ids" | "search" | "filter";

export interface SelectedEntry {
	id: number;
	word: string;
}

export interface FilterDraft {
	pos: string;
	nounClass: string;
	source: string;
	level: string;
	problem: string;
}

const emptyFilter: FilterDraft = {
	pos: "",
	nounClass: "",
	source: "",
	level: "",
	problem: "",
};

const getErrorMessage = (err: unknown): string => {
	if (err instanceof ApiError) return err.message;
	if (err instanceof Error) return err.message;
	return String(err);
};

const newOp = (): FieldOpDraft => ({
	id: crypto.randomUUID(),
	field: "",
	rawValue: "",
});

interface Args {
	dict: Dictionary["admin"]["entriesBulk"];
}

export const useBulkWizard = ({ dict }: Args) => {
	const [step, setStep] = useState<Step>(1);
	const [method, setMethod] = useState<SelectionMethod>("ids");

	// Method 1: IDs textarea
	const [idsInput, setIdsInput] = useState("");

	// Selected entries (chips)
	const [selected, setSelected] = useState<SelectedEntry[]>([]);

	// Method 3: filter
	const [filter, setFilter] = useState<FilterDraft>(emptyFilter);

	// Operations
	const [operations, setOperations] = useState<FieldOpDraft[]>([newOp()]);

	// Result state
	const [result, setResult] = useState<BulkUpdateResponse | null>(null);
	const [resultError, setResultError] = useState<string | null>(null);

	// Derived: effective selected IDs
	const idsFromTextarea = useMemo(() => parseIds(idsInput), [idsInput]);

	const selectedIds = useMemo(() => {
		const fromChips = selected.map((s) => s.id);
		const base =
			method === "ids" && fromChips.length === 0 ? idsFromTextarea : fromChips;
		// Always dedupe + cap
		const seen = new Set<number>();
		const out: number[] = [];
		for (const id of base) {
			if (seen.has(id)) continue;
			seen.add(id);
			out.push(id);
			if (out.length >= BULK_MAX) break;
		}
		return out;
	}, [method, idsFromTextarea, selected]);

	const overLimit =
		(method === "ids"
			? idsFromTextarea.length
			: selected.length) > BULK_MAX;

	const resolvedOps = useMemo(
		() => resolveOperations(operations),
		[operations],
	);

	const canProceedFromStep1 =
		selectedIds.length > 0 && selectedIds.length <= BULK_MAX;
	const canProceedFromStep2 = resolvedOps.length > 0;

	// Batch fetch current values for preview (step 3)
	const batchQuery = useBatchFetchAdminEntries(selectedIds, {
		enabled: step === 3 && selectedIds.length > 0,
	});

	const previewRows = useMemo(
		() =>
			batchQuery.data ? buildPreviewRows(batchQuery.data, resolvedOps) : [],
		[batchQuery.data, resolvedOps],
	);

	// Mutations
	const updateMutation = useBulkUpdateAdminEntries();
	const filterMutation = useBulkFilterAdminEntries();
	const problemsMutation = useBulkFindProblems();

	// Selection helpers
	const addEntry = useCallback((entry: SelectedEntry) => {
		setSelected((prev) => {
			if (prev.some((s) => s.id === entry.id)) return prev;
			if (prev.length >= BULK_MAX) return prev;
			return [...prev, entry];
		});
	}, []);

	const toggleEntry = useCallback((entry: SelectedEntry) => {
		setSelected((prev) => {
			const idx = prev.findIndex((s) => s.id === entry.id);
			if (idx >= 0) return prev.filter((_, i) => i !== idx);
			if (prev.length >= BULK_MAX) return prev;
			return [...prev, entry];
		});
	}, []);

	const removeEntry = useCallback((id: number) => {
		setSelected((prev) => prev.filter((s) => s.id !== id));
	}, []);

	const clearSelection = useCallback(() => {
		setSelected([]);
		setIdsInput("");
	}, []);

	// Method switcher — doesn't clear previously selected chips so user
	// can combine methods.
	const pickMethod = useCallback((m: SelectionMethod) => setMethod(m), []);

	// Filter: run search
	const runFilter = useCallback(async () => {
		try {
			if (filter.problem) {
				const res = await problemsMutation.mutateAsync({
					type: filter.problem,
					limit: BULK_MAX,
				});
				setSelected((prev) => {
					const existing = new Set(prev.map((s) => s.id));
					const next = [...prev];
					for (const row of res.data) {
						if (existing.has(row.id)) continue;
						next.push({ id: row.id, word: row.word });
						if (next.length >= BULK_MAX) break;
					}
					return next;
				});
				toast.success(
					dict.toast.filterFound.replace("{count}", String(res.data.length)),
				);
			} else {
				const res = await filterMutation.mutateAsync({
					pos: filter.pos || undefined,
					nounClass: filter.nounClass || undefined,
					source: filter.source || undefined,
					level: filter.level || undefined,
					limit: BULK_MAX,
				});
				setSelected((prev) => {
					const existing = new Set(prev.map((s) => s.id));
					const next = [...prev];
					for (const row of res.data) {
						if (existing.has(row.id)) continue;
						next.push({ id: row.id, word: row.word });
						if (next.length >= BULK_MAX) break;
					}
					return next;
				});
				toast.success(
					dict.toast.filterFound.replace("{count}", String(res.data.length)),
				);
			}
		} catch (err) {
			toast.error(getErrorMessage(err));
		}
	}, [dict, filter, filterMutation, problemsMutation]);

	// Operations helpers
	const addOperation = useCallback(() => {
		setOperations((prev) => [...prev, newOp()]);
	}, []);

	const removeOperation = useCallback((id: string) => {
		setOperations((prev) =>
			prev.length === 1 ? prev : prev.filter((o) => o.id !== id),
		);
	}, []);

	const updateOperation = useCallback(
		(id: string, patch: Partial<FieldOpDraft>) => {
			setOperations((prev) =>
				prev.map((o) =>
					o.id === id
						? {
								...o,
								...patch,
								// Reset value when field changes
								rawValue:
									patch.field !== undefined && patch.field !== o.field
										? ""
										: (patch.rawValue ?? o.rawValue),
							}
						: o,
				),
			);
		},
		[],
	);

	// Step navigation
	const goToStep = useCallback((next: Step) => {
		setStep(next);
		if (typeof window !== "undefined") {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}, []);

	const applyUpdate = useCallback(async () => {
		setResult(null);
		setResultError(null);
		const payload = buildPayload(selectedIds, resolvedOps);
		goToStep(4);
		try {
			const res = await updateMutation.mutateAsync(payload);
			setResult(res);
			toast.success(
				dict.toast.updateSuccess
					.replace("{updated}", String(res.updated))
					.replace("{total}", String(res.total)),
			);
		} catch (err) {
			const message = getErrorMessage(err);
			setResultError(message);
			toast.error(dict.toast.updateError.replace("{message}", message));
		}
	}, [dict, goToStep, resolvedOps, selectedIds, updateMutation]);

	const reset = useCallback(() => {
		setStep(1);
		setMethod("ids");
		setIdsInput("");
		setSelected([]);
		setFilter(emptyFilter);
		setOperations([newOp()]);
		setResult(null);
		setResultError(null);
		updateMutation.reset();
	}, [updateMutation]);

	return {
		// State
		step,
		method,
		idsInput,
		selected,
		selectedIds,
		filter,
		operations,
		resolvedOps,
		result,
		resultError,
		overLimit,
		// Mutations/queries
		isApplying: updateMutation.isPending,
		batchLoading: batchQuery.isLoading,
		batchError: batchQuery.isError
			? getErrorMessage(batchQuery.error)
			: null,
		filterLoading: filterMutation.isPending || problemsMutation.isPending,
		previewRows,
		// Flags
		canProceedFromStep1,
		canProceedFromStep2,
		// Actions
		setIdsInput,
		pickMethod,
		addEntry,
		toggleEntry,
		removeEntry,
		clearSelection,
		setFilter,
		runFilter,
		addOperation,
		removeOperation,
		updateOperation,
		goToStep,
		applyUpdate,
		reset,
	};
};

export type BulkWizard = ReturnType<typeof useBulkWizard>;
