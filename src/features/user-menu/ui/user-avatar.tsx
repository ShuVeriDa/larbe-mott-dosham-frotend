import { cn } from "@/shared/lib";
import type { FC } from "react";

interface UserAvatarProps {
	initials: string;
	size?: "sm" | "md";
	className?: string;
}

export const UserAvatar: FC<UserAvatarProps> = ({
	initials,
	size = "sm",
	className,
}) => (
	<span
		aria-hidden="true"
		className={cn(
			"flex items-center justify-center rounded-full bg-primary-dim text-primary font-bold uppercase tracking-tight shrink-0 select-none",
			size === "sm" ? "w-8 h-8 text-sm" : "w-11 h-11 text-md",
			className,
		)}
	>
		{initials}
	</span>
);
