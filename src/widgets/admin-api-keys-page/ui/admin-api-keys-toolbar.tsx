"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import {
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui";
import { SearchIcon } from "lucide-react";
import { type ChangeEvent, type FC, useId } from "react";
import type {
	RoleFilter,
	StatusFilter,
} from "../model/use-admin-api-keys-page";

interface AdminApiKeysToolbarProps {
	dict: Dictionary["admin"]["apiKeys"]["toolbar"];
	rolesDict: Dictionary["admin"]["apiKeys"]["roles"];
	statusesDict: Dictionary["admin"]["apiKeys"]["statuses"];
	searchValue: string;
	onSearchChange: (value: string) => void;
	roleValue: RoleFilter;
	onRoleChange: (value: RoleFilter) => void;
	statusValue: StatusFilter;
	onStatusChange: (value: StatusFilter) => void;
}

const ALL = "__all__";

const ROLE_OPTIONS: RoleFilter[] = ["readonly", "editor", "admin"];
const STATUS_OPTIONS: StatusFilter[] = ["active", "revoked", "expired"];

export const AdminApiKeysToolbar: FC<AdminApiKeysToolbarProps> = ({
	dict,
	rolesDict,
	statusesDict,
	searchValue,
	onSearchChange,
	roleValue,
	onRoleChange,
	statusValue,
	onStatusChange,
}) => {
	const searchId = useId();
	const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
		onSearchChange(e.target.value);

	return (
		<div className="flex flex-col gap-3 mb-4 sm:flex-row sm:flex-wrap sm:items-center">
			<div className="relative flex-1 min-w-0 sm:max-w-[360px]">
				<SearchIcon
					className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-muted)] pointer-events-none"
					aria-hidden
				/>
				<label htmlFor={searchId} className="sr-only">
					{dict.searchAriaLabel}
				</label>
				<Input
					id={searchId}
					type="search"
					value={searchValue}
					onChange={handleSearch}
					placeholder={dict.searchPlaceholder}
					aria-label={dict.searchAriaLabel}
					className="h-[38px] pl-9 text-sm"
				/>
			</div>

			<Select
				value={roleValue === "" ? ALL : roleValue}
				onValueChange={(v) =>
					onRoleChange(v === ALL ? "" : (v as RoleFilter))
				}
			>
				<SelectTrigger
					className="h-[38px] min-w-[160px]"
					aria-label={dict.roleLabel}
				>
					<SelectValue placeholder={dict.roleAll} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL}>{dict.roleAll}</SelectItem>
					{ROLE_OPTIONS.map((role) =>
						role === "" ? null : (
							<SelectItem key={role} value={role}>
								{rolesDict[role]}
							</SelectItem>
						),
					)}
				</SelectContent>
			</Select>

			<Select
				value={statusValue === "" ? ALL : statusValue}
				onValueChange={(v) =>
					onStatusChange(v === ALL ? "" : (v as StatusFilter))
				}
			>
				<SelectTrigger
					className="h-[38px] min-w-[160px]"
					aria-label={dict.statusLabel}
				>
					<SelectValue placeholder={dict.statusAll} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL}>{dict.statusAll}</SelectItem>
					{STATUS_OPTIONS.map((status) =>
						status === "" ? null : (
							<SelectItem key={status} value={status}>
								{statusesDict[status]}
							</SelectItem>
						),
					)}
				</SelectContent>
			</Select>
		</div>
	);
};
