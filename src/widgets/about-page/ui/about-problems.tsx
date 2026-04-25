import type { Dictionary } from "@/i18n/dictionaries";
import { Typography } from "@/shared/ui";
import { FC } from "react";
import { PROBLEM_ENTRIES } from "../model/problems";
import { AboutSectionTitle } from "./about-section-title";

interface IAboutProblemsProps {
	problems: Dictionary["about"]["problems"];
}

export const AboutProblems: FC<IAboutProblemsProps> = ({ problems }) => (
	<section className="mb-12" aria-labelledby="about-problems-heading">
		<AboutSectionTitle id="about-problems-heading">
			{problems.title}
		</AboutSectionTitle>
		<Typography
			tag="p"
			className="text-base text-subtle leading-[1.8] mb-4"
		>
			{problems.description}
		</Typography>
		<ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none">
			{PROBLEM_ENTRIES.map(({ key, icon }) => (
				<li
					key={key}
					className="flex items-start gap-3 p-4 bg-surface border border-edge rounded-lg text-sm text-subtle leading-[1.5]"
				>
					<span aria-hidden="true" className="text-[1.1rem] shrink-0 mt-px">
						{icon}
					</span>
					<span>{problems.items[key]}</span>
				</li>
			))}
		</ul>
	</section>
);
