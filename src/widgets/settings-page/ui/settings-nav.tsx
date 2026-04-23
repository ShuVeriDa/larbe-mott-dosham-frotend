"use client";

import { cn } from "@/shared/lib";
import type { FC, ReactNode } from "react";

export type SettingsSectionKey =
	| "general"
	| "dictionary"
	| "notifications"
	| "privacy"
	| "data";

interface SettingsNavItem {
	key: SettingsSectionKey;
	icon: ReactNode;
	label: string;
}

interface SettingsNavProps {
	items: readonly SettingsNavItem[];
	active: SettingsSectionKey;
	onChange: (key: SettingsSectionKey) => void;
}

export const SettingsNav: FC<SettingsNavProps> = ({
	items,
	active,
	onChange,
}) => (
	<nav
		aria-label="Settings sections"
		className={cn(
			"md:w-[180px] md:shrink-0 md:sticky md:top-20 md:self-start",
			"flex md:flex-col gap-1 max-md:overflow-x-auto max-md:pb-3",
			"max-md:mb-6 max-md:border-b max-md:border-edge",
		)}
	>
		{items.map(item => {
			const isActive = item.key === active;
			return (
				<button
					key={item.key}
					type="button"
					onClick={() => onChange(item.key)}
					aria-current={isActive ? "page" : undefined}
					className={cn(
						"flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors text-left whitespace-nowrap",
						"max-md:py-2 max-md:px-3 max-md:rounded-full max-md:text-xs",
						isActive
							? "text-primary bg-primary/10"
							: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
					)}
				>
					<span
						aria-hidden
						className="w-[18px] text-center shrink-0 text-[0.95rem] max-md:hidden"
					>
						{item.icon}
					</span>
					<span>{item.label}</span>
				</button>
			);
		})}
	</nav>
);
