import type { AdminUserListItem } from "@/features/admin-users";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { avatarToneClass, getInitials } from "../lib/format";

interface UserCellProps {
	user: Pick<AdminUserListItem, "id" | "name" | "email">;
	dense?: boolean;
}

export const UserCell: FC<UserCellProps> = ({ user, dense }) => {
	const tone = avatarToneClass(user.id);
	const initials = getInitials(user.name);

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
				<span className="font-semibold text-foreground truncate">
					{user.name}
				</span>
				<span className="text-xs text-muted-foreground truncate max-w-[220px]">
					{user.email}
				</span>
			</span>
		</div>
	);
};
