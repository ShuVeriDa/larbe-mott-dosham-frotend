import type { RoleName } from "@/entities/user";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface UserRoleBadgeProps {
	role: RoleName;
	className?: string;
}

const styles: Record<RoleName, string> = {
	USER: "bg-surface text-muted border border-edge",
	EDITOR: "bg-warning-dim text-warning",
	ADMIN: "bg-danger-dim text-danger",
};

export const UserRoleBadge: FC<UserRoleBadgeProps> = ({ role, className }) => (
	<span
		className={cn(
			"inline-flex items-center gap-[3px] px-1.5 py-px rounded-xs font-mono text-[0.62rem] font-bold uppercase tracking-[0.06em] shrink-0",
			styles[role],
			className,
		)}
	>
		{role}
	</span>
);
