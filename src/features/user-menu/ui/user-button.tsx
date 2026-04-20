"use client";

import type { RoleName } from "@/entities/user";
import { cn } from "@/shared/lib";
import { ChevronDownIcon } from "lucide-react";
import { forwardRef } from "react";
import { UserAvatar } from "./user-avatar";

interface UserButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	initials: string;
	displayName: string;
	role: RoleName;
	hasNotification?: boolean;
	ariaLabel: string;
	roleDotTitle: string;
}

const roleDotColor: Record<RoleName, string> = {
	USER: "bg-primary",
	EDITOR: "bg-warning",
	ADMIN: "bg-danger",
};

export const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
	(
		{
			initials,
			displayName,
			role,
			hasNotification,
			ariaLabel,
			roleDotTitle,
			className,
			...rest
		},
		ref,
	) => (
		<button
			ref={ref}
			type="button"
			aria-haspopup="menu"
			aria-label={ariaLabel}
			className={cn(
				"group relative inline-flex items-center gap-2 h-[38px] pl-[3px] pr-3 rounded-full",
				"bg-surface border border-edge text-foreground font-medium text-sm",
				"transition-colors duration-150 ease-[var(--ease-out)]",
				"hover:bg-surface-hover hover:border-edge-hover",
				"focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_var(--accent-dim)] focus-visible:outline-none",
				"data-[state=open]:bg-surface-hover data-[state=open]:border-edge-accent data-[state=open]:shadow-[0_0_0_3px_var(--accent-dim)]",
				"max-[680px]:w-[38px] max-[680px]:pr-[3px] max-[680px]:justify-center",
				className,
			)}
			{...rest}
		>
			<span className="relative">
				<UserAvatar initials={initials} size="sm" />
				{hasNotification && (
					<span
						aria-hidden="true"
						className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background animate-pulse"
					/>
				)}
			</span>

			<span className="leading-none overflow-hidden text-ellipsis whitespace-nowrap max-w-[140px] max-[680px]:hidden">
				{displayName}
			</span>

			<ChevronDownIcon
				aria-hidden="true"
				className="w-3.5 h-3.5 text-muted shrink-0 transition-transform duration-150 group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary max-[680px]:hidden"
			/>

			{role !== "USER" && (
				<span
					aria-hidden="true"
					title={roleDotTitle}
					className={cn(
						"absolute bottom-[-1px] right-[-1px] w-3 h-3 rounded-full border-2 border-background",
						roleDotColor[role],
					)}
				/>
			)}
		</button>
	),
);
UserButton.displayName = "UserButton";
