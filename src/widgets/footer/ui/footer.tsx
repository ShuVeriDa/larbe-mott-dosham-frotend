import type { Dictionary } from "@/i18n/dictionaries";
import { FC } from "react";
import { FooterStatsCount } from "./footer-stats-count";

interface FooterProps {
	footer: Dictionary["footer"];
}

export const Footer: FC<FooterProps> = ({ footer }) => {
	return (
		<section className="border-t border-edge py-3 px-6">
			<div className="max-w-[1020px] flex flex-col sm:flex-row justify-between items-center flex-wrap gap-4">
				<p className="text-sm text-muted-foreground">
					{footer.title} · {footer.tagline} ·{" "}
					<FooterStatsCount
						fallback={0}
						singular={footer.entriesSingular}
						plural={footer.entriesPlural}
					/>
				</p>
			</div>
		</section>
	);
};
