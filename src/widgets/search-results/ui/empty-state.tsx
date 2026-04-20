"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import Link from "next/link";
import type { FC } from "react";

type EmptyDict = Dictionary["search"]["empty"];

interface EmptyStateProps {
	query: string;
	lemmaHint?: readonly string[];
	lang: string;
	dict: EmptyDict;
}

export const EmptyState: FC<EmptyStateProps> = ({
	query,
	lemmaHint,
	lang,
	dict,
}) => {
	const hasHint = lemmaHint && lemmaHint.length > 0;

	return (
		<div className="text-center py-16">
			<div className="text-[3rem] mb-4 opacity-30" aria-hidden>
				{dict.icon}
			</div>
			<p className="text-lg font-semibold text-foreground mb-2">{dict.title}</p>
			<p className="text-sm text-muted max-w-[360px] mx-auto mb-5">
				{dict.text.replace("{q}", query)}
			</p>

			{hasHint && (
				<p className="text-sm text-muted mb-5">
					{dict.lemmaHint}{" "}
					{lemmaHint!.map((hint, i) => (
						<span key={hint}>
							{i > 0 && ", "}
							<Link
								href={`/${lang}/search?q=${encodeURIComponent(hint)}`}
								className="text-primary font-semibold border-b border-primary/30 hover:border-primary"
							>
								{hint}
							</Link>
						</span>
					))}
				</p>
			)}

			<Link
				href={`/${lang}/search`}
				className="inline-flex items-center px-4 py-2 border border-edge rounded-full text-sm text-foreground/80 transition-colors hover:border-edge-hover hover:bg-surface hover:text-foreground"
			>
				{dict.newSearch}
			</Link>
		</div>
	);
};
