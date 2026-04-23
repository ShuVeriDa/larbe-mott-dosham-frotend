import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { FC } from "react";
import { formatCount } from "../lib/format-count";

interface SuggestionsHeaderProps {
	dict: Dictionary["suggestions"]["header"];
	lang: Locale;
	count: number;
}

export const SuggestionsHeader: FC<SuggestionsHeaderProps> = ({
	dict,
	lang,
	count,
}) => (
	<div className="mb-8">
		<h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
			{dict.title}
		</h1>
		<p className="text-base font-light text-muted">
			{dict.subtitlePrefix} ·{" "}
			<span className="text-primary font-semibold">
				{formatCount(count, dict, lang)}
			</span>
		</p>
	</div>
);
