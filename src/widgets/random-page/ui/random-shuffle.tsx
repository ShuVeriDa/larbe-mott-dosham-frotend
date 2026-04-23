"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface RandomShuffleProps {
	labels: Dictionary["random"]["shuffle"];
	onShuffle: () => void;
	isPending: boolean;
}

export const RandomShuffle: FC<RandomShuffleProps> = ({
	labels,
	onShuffle,
	isPending,
}) => (
	<div className="flex flex-col items-center gap-3 mt-8 relative z-10">
		<button
			type="button"
			onClick={onShuffle}
			disabled={isPending}
			className={cn(
				"group inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full text-base font-bold text-accent-on bg-primary border-none transition-all duration-150 cursor-pointer",
				"hover:-translate-y-0.5 hover:scale-[1.02] hover:brightness-110 hover:shadow-[var(--shadow-glow)]",
				"active:translate-y-0 active:scale-[0.98]",
				"disabled:opacity-70 disabled:cursor-wait disabled:hover:translate-y-0 disabled:hover:scale-100",
			)}
		>
			<span
				aria-hidden="true"
				className="inline-block transition-transform duration-400 group-hover:rotate-180"
			>
				🎲
			</span>
			<span>{isPending ? labels.loading : labels.button}</span>
		</button>

		<div className="flex items-center gap-2 text-xs text-faint">
			<kbd className="inline-flex items-center justify-center min-w-[22px] h-5 px-1 border border-edge rounded-xs font-mono text-[0.65rem] text-faint bg-surface">
				Ctrl
			</kbd>
			<span>+</span>
			<kbd className="inline-flex items-center justify-center min-w-[22px] h-5 px-1 border border-edge rounded-xs font-mono text-[0.65rem] text-faint bg-surface">
				R
			</kbd>
			<span>{labels.hintOr}</span>
			<kbd className="inline-flex items-center justify-center min-w-[44px] h-5 px-1 border border-edge rounded-xs font-mono text-[0.65rem] text-faint bg-surface">
				{labels.hintSpace}
			</kbd>
		</div>
	</div>
);
