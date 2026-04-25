"use client";

import {
	type AdminEntryFullResponse,
	useAdminEntry,
	useDeleteAdminEntry,
	useUpdateAdminEntry,
} from "@/features/admin-entries";
import type { Dictionary } from "@/i18n/dictionaries";
import { isApiError, toApiError } from "@/shared/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { buildEntryPatch } from "../lib/build-patch";

export type EntryTab =
	| "basic"
	| "meanings"
	| "grammar"
	| "phraseology"
	| "extra"
	| "json";

interface UseEntryEditorOptions {
	id: string;
	lang: string;
	dict: Dictionary["admin"]["entryEdit"];
}

const cloneEntry = (entry: AdminEntryFullResponse): AdminEntryFullResponse =>
	JSON.parse(JSON.stringify(entry)) as AdminEntryFullResponse;

const isEqual = (a: unknown, b: unknown): boolean =>
	JSON.stringify(a) === JSON.stringify(b);

export const useEntryEditor = ({ id, lang, dict }: UseEntryEditorOptions) => {
	const router = useRouter();
	const entryQuery = useAdminEntry(id);
	const updateMutation = useUpdateAdminEntry();
	const deleteMutation = useDeleteAdminEntry();

	const [draft, setDraft] = useState<AdminEntryFullResponse | null>(null);
	const [tab, setTab] = useState<EntryTab>("basic");
	const [fullJson, setFullJson] = useState<string>("");
	const [fullJsonValid, setFullJsonValid] = useState(true);

	useEffect(() => {
		if (entryQuery.data) {
			setDraft(cloneEntry(entryQuery.data));
			setFullJson(JSON.stringify(entryQuery.data, null, 2));
			setFullJsonValid(true);
		}
	}, [entryQuery.data]);

	const isDirty = useMemo(() => {
		if (!entryQuery.data || !draft) return false;
		return !isEqual(entryQuery.data, draft);
	}, [draft, entryQuery.data]);

	useEffect(() => {
		if (!isDirty) return;
		const handler = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
		};
		window.addEventListener("beforeunload", handler);
		return () => window.removeEventListener("beforeunload", handler);
	}, [isDirty]);

	const patch = useCallback(<K extends keyof AdminEntryFullResponse>(
		key: K,
		value: AdminEntryFullResponse[K],
	) => {
		setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
	}, []);

	const applyFullJson = useCallback(
		(raw: string) => {
			setFullJson(raw);
			try {
				const parsed = JSON.parse(raw) as AdminEntryFullResponse;
				setFullJsonValid(true);
				setDraft(parsed);
			} catch {
				setFullJsonValid(false);
			}
		},
		[],
	);

	const discardChanges = useCallback(() => {
		if (!entryQuery.data) return;
		const clone = cloneEntry(entryQuery.data);
		setDraft(clone);
		setFullJson(JSON.stringify(clone, null, 2));
		setFullJsonValid(true);
		toast(dict.saveBar.cancel);
	}, [dict.saveBar.cancel, entryQuery.data]);

	const save = useCallback(async () => {
		if (!draft) return;
		if (tab === "json" && !fullJsonValid) {
			toast.error(dict.json.invalid);
			return;
		}
		const payload =
			tab === "json"
				? buildEntryPatch(JSON.parse(fullJson) as AdminEntryFullResponse)
				: buildEntryPatch(draft);
		try {
			const updated = await updateMutation.mutateAsync({ id, payload });
			setDraft(cloneEntry(updated));
			setFullJson(JSON.stringify(updated, null, 2));
			setFullJsonValid(true);
			toast.success(dict.saveBar.saved);
		} catch (err) {
			const apiErr = isApiError(err) ? err : toApiError(err);
			if (apiErr.statusCode === 403) {
				toast.error(dict.saveBar.forbidden);
			} else {
				toast.error(apiErr.message || dict.saveBar.saveError);
			}
		}
	}, [
		dict.json.invalid,
		dict.saveBar.forbidden,
		dict.saveBar.saveError,
		dict.saveBar.saved,
		draft,
		fullJson,
		fullJsonValid,
		id,
		tab,
		updateMutation,
	]);

	const remove = useCallback(async () => {
		if (!entryQuery.data) return;
		const msg = dict.header.confirmDelete.replace(
			"{id}",
			String(entryQuery.data.id),
		);
		if (!window.confirm(msg)) return;
		try {
			await deleteMutation.mutateAsync({ id });
			toast.success(dict.header.deleted);
			router.push(`/${lang}/admin/entries`);
		} catch (err) {
			const apiErr = isApiError(err) ? err : toApiError(err);
			toast.error(apiErr.message || dict.header.deleteError);
		}
	}, [
		deleteMutation,
		dict.header.confirmDelete,
		dict.header.deleteError,
		dict.header.deleted,
		entryQuery.data,
		id,
		lang,
		router,
	]);

	return {
		entry: entryQuery.data,
		draft,
		setDraft,
		patch,
		isLoading: entryQuery.isLoading,
		isError: entryQuery.isError,
		error: entryQuery.error,
		refetch: entryQuery.refetch,
		tab,
		setTab,
		fullJson,
		applyFullJson,
		fullJsonValid,
		setFullJsonValid,
		isDirty,
		isSaving: updateMutation.isPending,
		isDeleting: deleteMutation.isPending,
		save,
		remove,
		discardChanges,
	};
};

export type UseEntryEditorReturn = ReturnType<typeof useEntryEditor>;
