import type { AdminUserListItem } from "@/features/admin-users";
import { cn } from "@/shared/lib";
import Link from "next/link";
import type { FC } from "react";
import { avatarToneClass, getInitials } from "../lib/format";

interface UserCellProps {
	user: Pick<AdminUserListItem, "id" | "name" | "email">;
	dense?: boolean;
	href?: string;
}

export const UserCell: FC<UserCellProps> = ({ user, dense, href }) => {
	const tone = avatarToneClass(user.id);
	const initials = getInitials(user.name);

	const name = href ? (
		<Link
			href={href}
			className="font-semibold text-foreground truncate hover:text-primary transition-colors"
		>
			{user.name}
		</Link>
	) : (
		<span className="font-semibold text-foreground truncate">{user.name}</span>
	);

	return (
		<div className="flex items-center gap-3 min-w-0">
			<span
				aria-hidden
				className={cn(
					"shrink-0 rounded-full flex items-center justify-center font-semibold uppercase",
					tone,
					dense ? "size-10 text-sm" : "size-9 text-xs",
				)}
			>
				{initials}
			</span>
			<span className="flex flex-col min-w-0">
				{name}
				<span className="text-xs text-muted-foreground truncate max-w-[220px]">
					{user.email}
				</span>
			</span>
		</div>
	);
};
