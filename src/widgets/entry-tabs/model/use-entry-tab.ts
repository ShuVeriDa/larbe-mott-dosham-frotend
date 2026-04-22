"use client";

import { useCallback, useEffect, useState } from "react";

export type EntryTabId =
	| "meanings"
	| "phraseology"
	| "citations"
	| "declension"
	| "conjugation"
	| "sources";

const KNOWN: readonly EntryTabId[] = [
	"meanings",
	"phraseology",
	"citations",
	"declension",
	"conjugation",
	"sources",
];

const isKnown = (value: string): value is EntryTabId =>
	(KNOWN as readonly string[]).includes(value);

const readHashTab = (): EntryTabId | null => {
	if (typeof window === "undefined") return null;
	const hash = window.location.hash.replace(/^#/, "");
	return hash && isKnown(hash) ? hash : null;
};

interface UseEntryTabResult {
	active: EntryTabId;
	setActive: (next: EntryTabId) => void;
}

export const useEntryTab = (
	available: readonly EntryTabId[],
	initial: EntryTabId,
): UseEntryTabResult => {
	const [active, setActiveState] = useState<EntryTabId>(initial);

	useEffect(() => {
		const hashTab = readHashTab();
		if (hashTab && available.includes(hashTab)) {
			setActiveState(hashTab);
		}
		const onHashChange = () => {
			const next = readHashTab();
			if (next && available.includes(next)) setActiveState(next);
		};
		window.addEventListener("hashchange", onHashChange);
		return () => window.removeEventListener("hashchange", onHashChange);
	}, [available]);

	const setActive = useCallback((next: EntryTabId) => {
		setActiveState(next);
		if (typeof window !== "undefined") {
			const newHash = `#${next}`;
			if (window.location.hash !== newHash) {
				history.replaceState(null, "", newHash);
			}
		}
	}, []);

	return { active, setActive };
};
