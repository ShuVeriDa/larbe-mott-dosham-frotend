"use client";

import type { ApiKey } from "@/features/admin-api-keys";
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
import { formatDate, getKeyStatus } from "../lib/format";
import type { SortBy, SortDir } from "../model/use-admin-api-keys-page";
import { AdminApiKeysRowActions } from "./admin-api-keys-row-actions";
import { KeyIcon } from "./key-icon";
import { RoleBadge } from "./role-badge";
import { StatusBadge } from "./status-badge";

interface AdminApiKeysTableProps {
	dict: Dictionary["admin"]["apiKeys"];
	items: ApiKey[];
	sortBy: SortBy;
	sortDir: SortDir;
	onSortChange: (column: SortBy) => void;
	onEdit: (key: ApiKey) => void;
	onRevoke: (key: ApiKey) => void;
	isFetching?: boolean;
}

interface SortableHeadProps {
	column: SortBy;
	current: SortBy;
	dir: SortDir;
	onClick: (col: SortBy) => void;
	children: ReactNode;
	sortDict: Dictionary["admin"]["apiKeys"]["sort"];
	className?: string;
}

const SortableHead: FC<SortableHeadProps> = ({
	column,
	current,
	dir,
	onClick,
	children,
	sortDict,
	className,
}) => {
	const active = current === column;
	const label = typeof children === "string" ? children : column;
	return (
		<TableHead
			className={cn("cursor-pointer select-none", className)}
			aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
		>
			<button
				type="button"
				onClick={() => onClick(column)}
				className={cn(
					"inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.06em] transition-colors",
					active
						? "text-[var(--accent)]"
						: "text-[var(--text-muted)] hover:text-[var(--text)]",
				)}
				aria-label={`${label} — ${dir === "asc" ? sortDict.asc : sortDict.desc}`}
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

export const AdminApiKeysTable: FC<AdminApiKeysTableProps> = ({
	dict,
	items,
	sortBy,
	sortDir,
	onSortChange,
	onEdit,
	onRevoke,
	isFetching,
}) => {
	const columns = dict.columns;
	const sort = dict.sort;

	return (
		<div
			className={cn(
				"hidden md:block overflow-x-auto border border-[var(--border)] rounded-2xl transition-opacity",
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
							sortDict={sort}
						>
							{columns.name}
						</SortableHead>
						<SortableHead
							column="prefix"
							current={sortBy}
							dir={sortDir}
							onClick={onSortChange}
							sortDict={sort}
						>
							{columns.prefix}
						</SortableHead>
						<SortableHead
							column="role"
							current={sortBy}
							dir={sortDir}
							onClick={onSortChange}
							sortDict={sort}
						>
							{columns.role}
						</SortableHead>
						<SortableHead
							column="status"
							current={sortBy}
							dir={sortDir}
							onClick={onSortChange}
							sortDict={sort}
						>
							{columns.status}
						</SortableHead>
						<SortableHead
							column="createdAt"
							current={sortBy}
							dir={sortDir}
							onClick={onSortChange}
							sortDict={sort}
						>
							{columns.createdAt}
						</SortableHead>
						<SortableHead
							column="lastUsedAt"
							current={sortBy}
							dir={sortDir}
							onClick={onSortChange}
							sortDict={sort}
						>
							{columns.lastUsed}
						</SortableHead>
						<TableHead className="w-[110px] text-right">
							<span className="sr-only">{columns.actions}</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map((key) => {
						const status = getKeyStatus(key);
						return (
							<TableRow key={key.id}>
								<TableCell>
									<div className="flex items-center gap-3">
										<KeyIcon seed={key.id} />
										<span className="font-semibold text-[var(--text)] whitespace-nowrap">
											{key.name}
										</span>
									</div>
								</TableCell>
								<TableCell>
									<span className="font-mono text-xs text-[var(--text-secondary)]">
										{key.prefix}
									</span>
								</TableCell>
								<TableCell>
									<RoleBadge role={key.role} dict={dict.roles} />
								</TableCell>
								<TableCell>
									<StatusBadge status={status} dict={dict.statuses} />
								</TableCell>
								<TableCell className="text-xs text-[var(--text-muted)]">
									{formatDate(key.createdAt) ?? "—"}
								</TableCell>
								<TableCell className="text-xs text-[var(--text-muted)]">
									{formatDate(key.lastUsedAt) ?? "—"}
								</TableCell>
								<TableCell className="w-[110px]">
									<AdminApiKeysRowActions
										status={status}
										apiKey={key}
										dict={dict.actions}
										onEdit={onEdit}
										onRevoke={onRevoke}
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
