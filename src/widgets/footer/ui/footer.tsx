import { LangSwitcher } from "@/features/lang-switcher";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { FC } from "react";
import { FooterStatsCount } from "./footer-stats-count";

interface FooterProps {
	lang: Locale;
	footer: Dictionary["footer"];
}

const langLabels = {
	che: "Нохчийн",
	ru: "Русский",
	en: "English",
} as const;

export const Footer: FC<FooterProps> = ({ lang, footer }) => {
	return (
		<section className="border-t border-edge py-3 px-6">
			<div className="w-full flex flex-col sm:flex-row justify-between items-center flex-wrap gap-4">
				<p className="text-sm text-muted-foreground">
					{footer.title} · {footer.tagline} ·{" "}
					<FooterStatsCount
						fallback={0}
						singular={footer.entriesSingular}
						plural={footer.entriesPlural}
					/>
				</p>
				<LangSwitcher currentLang={lang} labels={langLabels} />
			</div>
		</section>
	);
};
