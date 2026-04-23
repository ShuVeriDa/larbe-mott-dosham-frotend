import type { Phrase } from "@/entities/dictionary";
import { Typography } from "@/shared/ui";
import type { FC } from "react";

interface RandomPhrasesProps {
	label: string;
	phrases: Phrase[];
}

export const RandomPhrases: FC<RandomPhrasesProps> = ({ label, phrases }) => {
	if (!phrases.length) return null;

	return (
		<section className="mb-6" aria-label={label}>
			<Typography
				tag="h2"
				className="text-xs font-medium uppercase tracking-[0.06em] text-faint mb-3"
			>
				{label}
			</Typography>
			<ul className="flex flex-col gap-2">
				{phrases.map((phrase, idx) => (
					<li
						key={`${phrase.nah}-${idx}`}
						className="flex flex-wrap gap-3 px-4 py-3 bg-surface rounded-md text-sm"
					>
						<span className="font-medium text-foreground shrink-0">
							{phrase.nah}
						</span>
						<span className="text-faint hidden sm:inline" aria-hidden="true">
							—
						</span>
						<span className="text-muted font-light">{phrase.ru}</span>
					</li>
				))}
			</ul>
		</section>
	);
};
