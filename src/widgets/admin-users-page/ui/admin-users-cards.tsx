"use client";

import type { AdminUserListItem } from "@/features/admin-users";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { formatDate, primaryRole } from "../lib/format";
import { AdminUsersRowActions } from "./admin-users-row-actions";
import { RoleBadge } from "./role-badge";
import { UserCell } from "./user-cell";
import { UserStatusBadge } from "./user-status";

interface AdminUsersCardsProps {
	dict: Dictionary["adminUsers"];
	items: AdminUserListItem[];
	onEdit: (user: AdminUserListItem) => void;
	onToggleBlock: (user: AdminUserListItem) => void;
	currentUserId: string | undefined;
	isFetching?: boolean;
}

export const AdminUsersCards: FC<AdminUsersCardsProps> = ({
	dict,
	items,
	onEdit,
	onToggleBlock,
	currentUserId,
	isFetching,
}) => {
	const tableDict = dict.table;

	return (
		<ul
			className={cn(
				"md:hidden flex flex-col gap-3 list-none",
				isFetching && "opacity-60",
			)}
		>
			{items.map((user) => {
				const role = primaryRole(user);
				const created = formatDate(user.createdAt);
				const isSelf = !!currentUserId && currentUserId === user.id;

				return (
					<li
						key={user.id}
						className="bg-surface border border-border rounded-lg p-4"
					>
						<div className="mb-3">
							<UserCell user={user} dense />
							<div className="mt-1 text-xs text-muted-foreground truncate">
								@{user.username}
							</div>
						</div>
						<div className="flex flex-wrap items-center gap-3">
							<RoleBadge role={role} dict={dict.roles} />
							<UserStatusBadge status={user.status} dict={dict.statuses} />
							{created && (
								<span className="text-xs text-muted-foreground">
									{tableDict.registered}: {created}
								</span>
							)}
						</div>
						<AdminUsersRowActions
							user={user}
							dict={tableDict}
							onEdit={onEdit}
							onToggleBlock={onToggleBlock}
							disabled={isSelf && user.status !== "blocked"}
							variant="buttons"
						/>
					</li>
				);
			})}
		</ul>
	);
};
