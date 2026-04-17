"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";

type ErrorDict = Dictionary["search"]["error"];

interface ResultsErrorProps {
	dict: ErrorDict;
	onRetry: () => void;
}

export const ResultsError: FC<ResultsErrorProps> = ({ dict, onRetry }) => (
	<div className="text-center py-16">
		<p className="text-lg font-semibold text-foreground mb-2">{dict.title}</p>
		<p className="text-sm text-muted max-w-[360px] mx-auto mb-5">
			{dict.text}
		</p>
		<button
			type="button"
			onClick={onRetry}
			className="inline-flex items-center justify-center gap-2 h-9 px-5 text-sm font-semibold bg-primary text-primary-foreground border-none rounded-md cursor-pointer hover:brightness-105 transition"
		>
			{dict.retry}
		</button>
	</div>
);
