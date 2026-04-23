"use client";

import type {
	AdminUserListItem,
	AdminUserSortBy,
	AdminUserSortDir,
} from "@/features/admin-users";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/ui";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";
import type { FC, ReactNode } from "react";
import { formatDate, primaryRole } from "../lib/format";
import { AdminUsersRowActions } from "./admin-users-row-actions";
import { RoleBadge } from "./role-badge";
import { UserCell } from "./user-cell";
import { UserStatusBadge } from "./user-status";

interface AdminUsersTableProps {
	dict: Dictionary["adminUsers"];
	items: AdminUserListItem[];
	sortBy: AdminUserSortBy;
	sortDir: AdminUserSortDir;
	onSortChange: (column: AdminUserSortBy) => void;
	onEdit: (user: AdminUserListItem) => void;
	onToggleBlock: (user: AdminUserListItem) => void;
	currentUserId: string | undefined;
	isFetching?: boolean;
}

interface SortableHeadProps {
	column: AdminUserSortBy;
	current: AdminUserSortBy;
	dir: AdminUserSortDir;
	onClick: (col: AdminUserSortBy) => void;
	dict: Dictionary["adminUsers"]["table"];
	children: ReactNode;
	className?: string;
}

const SortableHead: FC<SortableHeadProps> = ({
	column,
	current,
	dir,
	onClick,
	dict,
	children,
	className,
}) => {
	const active = current === column;
	return (
		<TableHead
			className={cn("cursor-pointer select-none", className)}
			aria-sort={
				active ? (dir === "asc" ? "ascending" : "descending") : "none"
			}
		>
			<button
				type="button"
				onClick={() => onClick(column)}
				className={cn(
					"inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.06em] hover:text-foreground transition-colors",
					active ? "text-primary" : "text-muted-foreground",
				)}
				aria-label={`${typeof children === "string" ? children : column} — ${
					active && dir === "asc" ? dict.sortAsc : dict.sortDesc
				}`}
			>
				{children}
				{active ? (
					dir === "asc" ? (
						<ArrowUpIcon className="size-3" />
					) : (
						<ArrowDownIcon className="size-3" />
					)
				) : (
					<ArrowUpDownIcon className="size-3 opacity-30" />
				)}
			</button>
		</TableHead>
	);
};

export const AdminUsersTable: FC<AdminUsersTableProps> = ({
	dict,
	items,
	sortBy,
	sortDir,
	onSortChange,
	onEdit,
	onToggleBlock,
	currentUserId,
	isFetching,
}) => {
	const tableDict = dict.table;

	return (
		<div
			className={cn(
				"hidden md:block transition-opacity",
				isFetching && "opacity-60",
			)}
		>
			<Table>
				<TableHeader>
					<TableRow>
						<SortableHead
							column="name"
							current={sortBy}
							dir={sortDir}
							onClick={onSortChange}
							dict={tableDict}
						>
							{tableDict.user}
						</SortableHead>
						<SortableHead
							column="username"
							current={sortBy}
							dir={sortDir}
							onClick={onSortChange}
							dict={tableDict}
						>
							{tableDict.username}
						</SortableHead>
						<TableHead>{tableDict.role}</TableHead>
						<TableHead>{tableDict.status}</TableHead>
						<SortableHead
							column="createdAt"
							current={sortBy}
							dir={sortDir}
							onClick={onSortChange}
							dict={tableDict}
						>
							{tableDict.registered}
						</SortableHead>
						<SortableHead
							column="lastLoggedIn"
							current={sortBy}
							dir={sortDir}
							onClick={onSortChange}
							dict={tableDict}
						>
							{tableDict.lastLogin}
						</SortableHead>
						<TableHead className="w-[100px] text-right">
							<span className="sr-only">{tableDict.actions}</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map((user) => {
						const role = primaryRole(user);
						const created = formatDate(user.createdAt);
						const lastLogin = formatDate(user.lastLoggedIn);
						const isSelf = !!currentUserId && currentUserId === user.id;

						return (
							<TableRow key={user.id}>
								<TableCell>
									<UserCell user={user} />
								</TableCell>
								<TableCell className="font-mono text-xs text-muted-foreground">
									@{user.username}
								</TableCell>
								<TableCell>
									<RoleBadge role={role} dict={dict.roles} />
								</TableCell>
								<TableCell>
									<UserStatusBadge
										status={user.status}
										dict={dict.statuses}
									/>
								</TableCell>
								<TableCell className="text-xs text-muted-foreground">
									{created ?? "—"}
								</TableCell>
								<TableCell className="text-xs text-muted-foreground">
									{lastLogin ?? tableDict.never}
								</TableCell>
								<TableCell className="w-[100px]">
									<AdminUsersRowActions
										user={user}
										dict={tableDict}
										onEdit={onEdit}
										onToggleBlock={onToggleBlock}
										disabled={isSelf && user.status !== "blocked"}
									/>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
};
