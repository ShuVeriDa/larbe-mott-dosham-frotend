"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { Button, Typography } from "@/shared/ui";
import type { FC } from "react";

interface RandomCardErrorProps {
	labels: Dictionary["random"]["states"];
	onRetry: () => void;
	onResetFilter?: () => void;
	variant: "error" | "empty";
}

export const RandomCardError: FC<RandomCardErrorProps> = ({
	labels,
	onRetry,
	onResetFilter,
	variant,
}) => {
	const message = variant === "error" ? labels.error : labels.emptyForLevel;
	return (
		<div
			role="alert"
			className="relative bg-raised border border-edge rounded-xl p-8 max-w-[560px] w-full text-center"
		>
			<Typography tag="p" className="text-sm text-muted mb-4">
				{message}
			</Typography>
			<div className="flex flex-wrap gap-2 justify-center">
				{variant === "empty" && onResetFilter ? (
					<Button variant="outline" size="sm" onClick={onResetFilter}>
						<Typography tag="span">{labels.resetFilter}</Typography>
					</Button>
				) : (
					<Button variant="outline" size="sm" onClick={onRetry}>
						<Typography tag="span">{labels.retry}</Typography>
					</Button>
				)}
			</div>
		</div>
	);
};
