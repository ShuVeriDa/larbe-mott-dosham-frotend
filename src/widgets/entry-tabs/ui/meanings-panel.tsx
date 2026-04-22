import type { Meaning } from "@/entities/dictionary";
import type { FC } from "react";

interface MeaningsPanelProps {
	meanings: Meaning[];
	emptyLabel: string;
}

export const MeaningsPanel: FC<MeaningsPanelProps> = ({
	meanings,
	emptyLabel,
}) => {
	if (meanings.length === 0) {
		return <p className="text-sm text-muted py-4">{emptyLabel}</p>;
	}

	return (
		<div>
			{meanings.map((meaning, index) => (
				<article
					key={index}
					className="relative mb-6 pl-5 border-l-2 border-edge"
				>
					<span
						aria-hidden
						className="absolute -left-3 -top-0.5 w-[22px] h-[22px] bg-background border border-edge rounded-full text-[0.65rem] font-bold text-muted flex items-center justify-center"
					>
						{index + 1}
					</span>
					<p className="text-md text-foreground font-normal mb-3 leading-normal">
						{meaning.translation}
					</p>
					{meaning.examples && meaning.examples.length > 0 && (
						<ul className="flex flex-col gap-2">
							{meaning.examples.map((ex, i) => (
								<li
									key={i}
									className="flex flex-col gap-0.5 px-3 py-2 bg-surface rounded-md text-sm"
								>
									<span className="text-foreground font-medium" lang="ce">
										{ex.nah}
									</span>
									<span className="text-muted font-light italic">{ex.ru}</span>
								</li>
							))}
						</ul>
					)}
				</article>
			))}
		</div>
	);
};
