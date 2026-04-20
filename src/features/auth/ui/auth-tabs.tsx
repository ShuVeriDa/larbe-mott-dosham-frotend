"use client";

import { cn } from "@/shared/lib";

export type AuthTab = "login" | "register";

interface AuthTabsProps {
	value: AuthTab;
	onChange: (tab: AuthTab) => void;
	labels: {
		login: string;
		register: string;
	};
}

export const AuthTabs = ({ value, onChange, labels }: AuthTabsProps) => {
	const tabs: { id: AuthTab; label: string }[] = [
		{ id: "login", label: labels.login },
		{ id: "register", label: labels.register },
	];

	return (
		<div
			role="tablist"
			aria-label="Auth mode"
			className="mb-6 flex gap-1 rounded-md bg-surface p-[3px]"
		>
			{tabs.map(tab => {
				const active = value === tab.id;
				return (
					<button
						key={tab.id}
						type="button"
						role="tab"
						aria-selected={active}
						aria-controls={`auth-panel-${tab.id}`}
						id={`auth-tab-${tab.id}`}
						onClick={() => onChange(tab.id)}
						className={cn(
							"flex-1 rounded-sm px-3 py-2 text-sm font-medium transition-colors duration-150",
							active
								? "bg-primary text-primary-foreground font-semibold"
								: "bg-transparent text-muted hover:text-subtle",
						)}
					>
						{tab.label}
					</button>
				);
			})}
		</div>
	);
};
