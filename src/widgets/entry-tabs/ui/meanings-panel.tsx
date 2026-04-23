import type { Meaning } from "@/entities/dictionary";
import type { FC } from "react";

interface MeaningsPanelProps {
	meanings: Meaning[];
	emptyLabel: string;
	/**
	 * When true, example lists are expanded by default; otherwise they start
	 * collapsed behind a <summary>. Driven by `user.prefShowExamples`.
	 */
	defaultExamplesOpen?: boolean;
}

export const MeaningsPanel: FC<MeaningsPanelProps> = ({
	meanings,
	emptyLabel,
	defaultExamplesOpen = false,
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
						<details
							open={defaultExamplesOpen}
							className="group/examples"
						>
							<summary className="cursor-pointer list-none text-xs text-muted mb-2 select-none inline-flex items-center gap-1 hover:text-foreground transition-colors">
								<span className="transition-transform group-open/examples:rotate-90">
									▸
								</span>
								<span>
									{meaning.examples.length}{" "}
									{meaning.examples.length === 1 ? "example" : "examples"}
								</span>
							</summary>
							<ul className="flex flex-col gap-2">
								{meaning.examples.map((ex, i) => (
									<li
										key={i}
										className="flex flex-col gap-0.5 px-3 py-2 bg-surface rounded-md text-sm"
									>
										<span className="text-foreground font-medium" lang="ce">
											{ex.nah}
										</span>
										<span className="text-muted font-light italic">
											{ex.ru}
										</span>
									</li>
								))}
							</ul>
						</details>
					)}
				</article>
			))}
		</div>
	);
};
