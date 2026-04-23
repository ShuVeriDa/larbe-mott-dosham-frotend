"use client";

import { Button } from "@/shared/ui";
import type { FC, ReactNode } from "react";

interface ExportCardProps {
	icon: ReactNode;
	title: string;
	description: string;
	buttonLabel: string;
	onDownload: () => void;
	disabled?: boolean;
}

export const ExportCard: FC<ExportCardProps> = ({
	icon,
	title,
	description,
	buttonLabel,
	onDownload,
	disabled,
}) => (
	<div className="flex items-center gap-4 p-4 rounded-lg border border-edge bg-muted/30 mb-3 last:mb-0 max-sm:flex-col max-sm:text-center">
		<div
			aria-hidden
			className="size-10 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0"
		>
			{icon}
		</div>
		<div className="flex-1 min-w-0">
			<div className="text-sm font-medium">{title}</div>
			<div className="text-xs text-muted-foreground mt-0.5">{description}</div>
		</div>
		<Button
			variant="secondary"
			size="sm"
			onClick={onDownload}
			disabled={disabled}
			className="max-sm:w-full"
		>
			{buttonLabel}
		</Button>
	</div>
);
