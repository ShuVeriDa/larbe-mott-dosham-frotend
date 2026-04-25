import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Typography } from "@/shared/ui";
import { FC } from "react";

interface IAboutStatRowProps {
	stats: Dictionary["about"]["stats"];
	total: number | null;
	locale: Locale;
}

const localeMap: Record<Locale, string> = {
	ru: "ru-RU",
	en: "en-US",
	che: "ru-RU",
};

const formatEntries = (total: number | null, locale: Locale, fallback: string) => {
	if (total === null) return fallback;
	return `${total.toLocaleString(localeMap[locale])}+`;
};

export const AboutStatRow: FC<IAboutStatRowProps> = ({
	stats,
	total,
	locale,
}) => {
	const items = [
		{
			key: "entries",
			value: formatEntries(total, locale, stats.fallbackEntries),
			label: stats.entries,
		},
		{
			key: "sources",
			value: "14",
			label: stats.sources,
		},
		{
			key: "grammar",
			value: stats.grammarValue,
			label: stats.grammarLabel,
		},
	];

	return (
		<section
			aria-label={stats.entries}
			className="grid grid-cols-1 md:grid-cols-3 gap-4 my-12"
		>
			{items.map(item => (
				<article
					key={item.key}
					className="p-5 bg-surface border border-edge rounded-lg text-center"
				>
					<div className="text-2xl font-bold text-primary leading-none mb-1 tabular-nums">
						{item.value}
					</div>
					<Typography tag="p" className="text-xs text-muted font-medium">
						{item.label}
					</Typography>
				</article>
			))}
		</section>
	);
};
