import type { UserStatus } from "@/entities/user";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface UserStatusBadgeProps {
	status: UserStatus;
	dict: Dictionary["adminUsers"]["statuses"];
}

const STATUS_DOT: Record<UserStatus, string> = {
	active: "bg-emerald-500",
	inactive: "bg-muted-foreground",
	blocked: "bg-red-500",
};

const STATUS_TEXT: Record<UserStatus, string> = {
	active: "text-emerald-600 dark:text-emerald-400",
	inactive: "text-muted-foreground",
	blocked: "text-red-600 dark:text-red-400",
};

export const UserStatusBadge: FC<UserStatusBadgeProps> = ({ status, dict }) => (
	<span
		className={cn(
			"inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap",
			STATUS_TEXT[status],
		)}
	>
		<span
			aria-hidden
			className={cn("size-[7px] rounded-full shrink-0", STATUS_DOT[status])}
		/>
		{dict[status]}
	</span>
);
