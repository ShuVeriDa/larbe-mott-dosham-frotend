"use client";

import { useCallback, useState } from "react";

export const useExpanded = () => {
	const [expanded, setExpanded] = useState<Set<number>>(() => new Set());

	const toggle = useCallback((id: number) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}, []);

	const isOpen = useCallback((id: number) => expanded.has(id), [expanded]);

	return { expanded, toggle, isOpen };
};
