"use client";

import { useCallback, useState } from "react";

export const useEntriesSelection = () => {
	const [selected, setSelected] = useState<Set<number>>(new Set());

	const toggle = useCallback((id: number) => {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}, []);

	const selectAll = useCallback((ids: number[]) => {
		setSelected((prev) => {
			const next = new Set(prev);
			for (const id of ids) next.add(id);
			return next;
		});
	}, []);

	const deselectAll = useCallback(() => setSelected(new Set()), []);

	const togglePage = useCallback((ids: number[]) => {
		setSelected((prev) => {
			const allSelected =
				ids.length > 0 && ids.every((id) => prev.has(id));
			const next = new Set(prev);
			if (allSelected) {
				for (const id of ids) next.delete(id);
			} else {
				for (const id of ids) next.add(id);
			}
			return next;
		});
	}, []);

	return {
		selected,
		selectedIds: [...selected],
		count: selected.size,
		isSelected: (id: number) => selected.has(id),
		toggle,
		selectAll,
		deselectAll,
		togglePage,
	};
};
