"use client";

import {
	dictionaryApi,
	type DictionarySearchResult,
} from "@/entities/dictionary";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Level } from "../lib/parse-level";

const FLIP_DURATION_MS = 260;

interface UseRandomPageOptions {
	initialLevel: Level;
}

interface UseRandomPageResult {
	activeLevel: Level;
	entry: DictionarySearchResult | null;
	isPending: boolean;
	isFlipping: boolean;
	isError: boolean;
	shuffle: () => void;
	changeLevel: (level: Level) => void;
	retry: () => void;
	resetFilter: () => void;
}

export const useRandomPage = ({
	initialLevel,
}: UseRandomPageOptions): UseRandomPageResult => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [activeLevel, setActiveLevel] = useState<Level>(initialLevel);
	const [entry, setEntry] = useState<DictionarySearchResult | null>(null);
	const [isFlipping, setIsFlipping] = useState(false);
	const flipTimerRef = useRef<number | null>(null);
	const didInitRef = useRef(false);

	const { mutate, isPending, isError, reset } = useMutation({
		mutationFn: (level: Level) =>
			dictionaryApi.getRandom(level === "ALL" ? undefined : level),
		onSuccess: data => setEntry(data ?? null),
	});

	const runFlip = useCallback(() => {
		if (flipTimerRef.current) window.clearTimeout(flipTimerRef.current);
		setIsFlipping(true);
		flipTimerRef.current = window.setTimeout(() => {
			setIsFlipping(false);
			flipTimerRef.current = null;
		}, FLIP_DURATION_MS);
	}, []);

	const shuffleAt = useCallback(
		(level: Level) => {
			runFlip();
			mutate(level);
		},
		[mutate, runFlip],
	);

	const shuffle = useCallback(() => shuffleAt(activeLevel), [activeLevel, shuffleAt]);

	const updateLevelParam = useCallback(
		(level: Level) => {
			const next = new URLSearchParams(searchParams.toString());
			if (level === "ALL") next.delete("level");
			else next.set("level", level);
			const qs = next.toString();
			router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
		},
		[pathname, router, searchParams],
	);

	const changeLevel = useCallback(
		(level: Level) => {
			if (level === activeLevel) return;
			setActiveLevel(level);
			updateLevelParam(level);
			shuffleAt(level);
		},
		[activeLevel, shuffleAt, updateLevelParam],
	);

	const retry = useCallback(() => {
		reset();
		shuffleAt(activeLevel);
	}, [activeLevel, reset, shuffleAt]);

	const resetFilter = useCallback(() => {
		changeLevel("ALL");
	}, [changeLevel]);

	// Initial fetch on mount — kick off the mutation directly so we don't
	// trigger a flip animation (no prior card to flip from) and don't set
	// unrelated state synchronously inside the effect.
	useEffect(() => {
		if (didInitRef.current) return;
		didInitRef.current = true;
		mutate(initialLevel);
	}, [initialLevel, mutate]);

	// Keyboard shortcuts: Space and Ctrl/Cmd+R.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			const tag = target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) {
				return;
			}
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r") {
				e.preventDefault();
				shuffle();
				return;
			}
			if (e.code === "Space" && !e.ctrlKey && !e.metaKey && !e.altKey) {
				e.preventDefault();
				shuffle();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [shuffle]);

	// Cleanup flip timer on unmount.
	useEffect(() => {
		return () => {
			if (flipTimerRef.current) window.clearTimeout(flipTimerRef.current);
		};
	}, []);

	return {
		activeLevel,
		entry,
		isPending,
		isFlipping,
		isError,
		shuffle,
		changeLevel,
		retry,
		resetFilter,
	};
};
