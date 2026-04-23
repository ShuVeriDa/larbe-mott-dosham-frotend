"use client";

import { cn } from "@/shared/lib";
import type { FC, ReactNode } from "react";

export type ProfileTabKey = "personal" | "security" | "settings" | "sessions";

interface Tab {
	key: ProfileTabKey;
	label: string;
}

interface ProfileTabsProps {
	active: ProfileTabKey;
	onChange: (key: ProfileTabKey) => void;
	tabs: Tab[];
	children: ReactNode;
}

export const ProfileTabs: FC<ProfileTabsProps> = ({
	active,
	onChange,
	tabs,
	children,
}) => (
	<>
		<div
			role="tablist"
			aria-orientation="horizontal"
			className="flex gap-1 mb-6 border-b border-edge overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
		>
			{tabs.map(tab => {
				const isActive = tab.key === active;
				return (
					<button
						key={tab.key}
						type="button"
						role="tab"
						id={`profile-tab-${tab.key}`}
						aria-selected={isActive}
						aria-controls={`profile-panel-${tab.key}`}
						onClick={() => onChange(tab.key)}
						className={cn(
							"px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-150 cursor-pointer",
							isActive
								? "text-primary border-primary"
								: "text-muted border-transparent hover:text-foreground",
						)}
					>
						{tab.label}
					</button>
				);
			})}
		</div>
		{children}
	</>
);

export const ProfileTabPanel: FC<{
	tab: ProfileTabKey;
	active: ProfileTabKey;
	children: ReactNode;
}> = ({ tab, active, children }) =>
	tab === active ? (
		<div
			role="tabpanel"
			id={`profile-panel-${tab}`}
			aria-labelledby={`profile-tab-${tab}`}
		>
			{children}
		</div>
	) : null;
