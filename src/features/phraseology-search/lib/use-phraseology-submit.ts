"use client";

import { fixPalochka } from "@/shared/lib";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { buildPhraseologyParams } from "./use-phraseology-url-state";

interface UsePhraseologySubmitOptions {
	exact?: boolean;
	initialQuery?: string;
}

export const usePhraseologySubmit = ({
	exact,
	initialQuery,
}: UsePhraseologySubmitOptions = {}) => {
	const router = useRouter();
	const params = useParams<{ lang: string }>();
	const inputRef = useRef<HTMLInputElement>(null);

	const submit = () => {
		const raw = inputRef.current?.value.trim();
		if (!raw) return;
		const q = fixPalochka(raw);
		if (inputRef.current && q !== raw) inputRef.current.value = q;
		const urlParams = buildPhraseologyParams({ q, exact, page: 1 });
		router.push(`/${params.lang}/phraseology?${urlParams.toString()}`);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") submit();
	};

	return { inputRef, submit, handleKeyDown, initialQuery };
};
