import type { Dictionary } from "@/i18n/dictionaries";
import { FC } from "react";
import { ROADMAP_ENTRIES } from "../model/roadmap";
import { AboutSectionTitle } from "./about-section-title";

interface IAboutRoadmapProps {
	roadmap: Dictionary["about"]["roadmap"];
}

export const AboutRoadmap: FC<IAboutRoadmapProps> = ({ roadmap }) => (
	<section className="mb-12" aria-labelledby="about-roadmap-heading">
		<AboutSectionTitle id="about-roadmap-heading">
			{roadmap.title}
		</AboutSectionTitle>
		<ul className="flex flex-col gap-3 mt-4 list-none">
			{ROADMAP_ENTRIES.map(({ key, icon }) => (
				<li
					key={key}
					className="flex items-center gap-3 px-4 py-3 bg-surface border border-edge rounded-md text-sm text-subtle"
				>
					<span aria-hidden="true" className="shrink-0 text-[0.9rem]">
						{icon}
					</span>
					<span>{roadmap.items[key]}</span>
				</li>
			))}
		</ul>
	</section>
);
