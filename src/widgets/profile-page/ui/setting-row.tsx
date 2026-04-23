"use client";

import { Switch } from "@/shared/ui";
import type { FC } from "react";

interface SettingRowProps {
	title: string;
	description: string;
	checked: boolean;
	onToggle: () => void;
	disabled?: boolean;
}

export const SettingRow: FC<SettingRowProps> = ({
	title,
	description,
	checked,
	onToggle,
	disabled,
}) => (
	<div className="flex items-center justify-between gap-4 py-4 border-b border-edge last:border-0">
		<div className="flex-1 min-w-0">
			<div className="text-base font-medium">{title}</div>
			<div className="text-xs text-muted mt-0.5">{description}</div>
		</div>
		<Switch
			checked={checked}
			onCheckedChange={onToggle}
			disabled={disabled}
			aria-label={title}
		/>
	</div>
);
