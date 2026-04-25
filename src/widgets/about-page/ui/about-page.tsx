import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { FC } from "react";
import { AboutCta } from "./about-cta";
import { AboutFeatures } from "./about-features";
import { AboutGrammar } from "./about-grammar";
import { AboutHero } from "./about-hero";
import { AboutProblems } from "./about-problems";
import { AboutRoadmap } from "./about-roadmap";
import { AboutSources } from "./about-sources";
import { AboutStatRow } from "./about-stat-row";

interface IAboutPageProps {
	about: Dictionary["about"];
	lang: Locale;
	total: number | null;
}

export const AboutPage: FC<IAboutPageProps> = ({ about, lang, total }) => (
	<div className="max-w-[860px] w-full mx-auto px-4 md:px-6 pt-10 pb-20">
		<AboutHero hero={about.hero} />
		<AboutStatRow stats={about.stats} total={total} locale={lang} />
		<AboutProblems problems={about.problems} />
		<AboutFeatures features={about.features} />
		<AboutGrammar grammar={about.grammar} />
		<AboutSources sources={about.sources} />
		<AboutRoadmap roadmap={about.roadmap} />
		<AboutCta cta={about.cta} lang={lang} />
	</div>
);
