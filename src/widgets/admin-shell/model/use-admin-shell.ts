"use client";

import { useCallback, useEffect, useState } from "react";

export const useAdminShell = () => {
	const [open, setOpen] = useState(false);

	const openSidebar = useCallback(() => setOpen(true), []);
	const closeSidebar = useCallback(() => setOpen(false), []);
	const toggleSidebar = useCallback(() => setOpen((v) => !v), []);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	useEffect(() => {
		if (typeof document === "undefined") return;
		if (open) {
			const prev = document.body.style.overflow;
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = prev;
			};
		}
	}, [open]);

	return { open, openSidebar, closeSidebar, toggleSidebar };
};
