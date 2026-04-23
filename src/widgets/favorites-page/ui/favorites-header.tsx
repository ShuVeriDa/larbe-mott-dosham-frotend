import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { FC } from "react";
import { formatCount } from "../lib/format-count";

interface FavoritesHeaderProps {
	dict: Dictionary["favoritesPage"]["header"];
	lang: Locale;
	count: number;
}

export const FavoritesHeader: FC<FavoritesHeaderProps> = ({
	dict,
	lang,
	count,
}) => (
	<header className="mb-8">
		<h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
			{dict.title}
		</h1>
		<p className="text-base text-muted font-light">
			{dict.subtitlePrefix} ·{" "}
			<span className="text-primary font-semibold">
				{formatCount(count, dict, lang)}
			</span>
		</p>
	</header>
);
