"use client";

import {
	buildPhraseologyParams,
	usePhraseologySubmit,
	usePhraseologyUrlState,
} from "@/features/phraseology-search";
import { ExactToggle } from "@/features/search";
import type { Dictionary } from "@/i18n/dictionaries";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useState, type FC } from "react";
import { PhraseologySearchHints } from "./phraseology-search-hints";
import { PhraseologySearchInput } from "./phraseology-search-input";

interface PhraseologySearchBarProps {
	phraseology: Dictionary["phraseology"];
	lang: string;
	/** When true, the bar mirrors state from the URL (used on the results view). */
	syncWithUrl?: boolean;
	/** Hide the hints row (used on the results view). */
	hideHints?: boolean;
}

export const PhraseologySearchBar: FC<PhraseologySearchBarProps> = ({
	phraseology,
	lang,
	syncWithUrl = false,
	hideHints = false,
}) => {
	const urlState = usePhraseologyUrlState();
	const router = useRouter();
	const params = useParams<{ lang: string }>();
	const pathname = usePathname();

	// На hero-странице `exact` держим в локальном state до первого submit.
	// На results-странице URL — единственный источник правды.
	const [localExact, setLocalExact] = useState(false);
	const exact = syncWithUrl ? urlState.exact : localExact;

	const { inputRef, submit, handleKeyDown } = usePhraseologySubmit({
		exact,
		initialQuery: urlState.q,
	});

	const isResultsState =
		pathname === `/${lang}/phraseology` && Boolean(urlState.q);

	const handleClear = useCallback(() => {
		if (inputRef.current) {
			inputRef.current.value = "";
			inputRef.current.focus();
		}
		if (syncWithUrl && urlState.q) {
			router.push(`/${params.lang}/phraseology`);
		} else {
			setLocalExact(false);
		}
	}, [inputRef, syncWithUrl, urlState.q, router, params.lang]);

	const handleExactToggle = useCallback(() => {
		const next = !exact;
		// На /phraseology с активным `q` — сразу перезапрашиваем с новым флагом,
		// чтобы результаты обновились и URL остался shareable.
		if (syncWithUrl && urlState.q) {
			const urlParams = buildPhraseologyParams({
				q: urlState.q,
				exact: next,
				page: 1,
			});
			router.push(`/${params.lang}/phraseology?${urlParams.toString()}`);
		} else {
			setLocalExact(next);
		}
	}, [exact, syncWithUrl, urlState.q, router, params.lang]);

	return (
		<>
			<PhraseologySearchInput
				ref={inputRef}
				onSubmit={submit}
				onKeyDown={handleKeyDown}
				onClear={handleClear}
				clearLabel={phraseology.clear}
				placeholder={phraseology.placeholder}
				buttonText={phraseology.button}
				isResultsState={isResultsState}
				defaultValue={syncWithUrl ? urlState.q : ""}
			/>
			<div className="flex justify-center mb-3">
				<ExactToggle
					active={exact}
					label={phraseology.exact.label}
					hint={phraseology.exact.hint}
					onToggle={handleExactToggle}
				/>
			</div>
			{!hideHints && (
				<PhraseologySearchHints
					label={phraseology.hints.label}
					words={phraseology.hints.words}
					lang={lang}
				/>
			)}
		</>
	);
};
