"use client";

import type {
	AdminUserRoleFilter,
	AdminUserStatusFilter,
} from "@/features/admin-users";
import type { Dictionary } from "@/i18n/dictionaries";
import {
	Button,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui";
import { DownloadIcon, SearchIcon } from "lucide-react";
import { type ChangeEvent, type FC, useId } from "react";

interface AdminUsersToolbarProps {
	dict: Dictionary["adminUsers"]["toolbar"];
	searchValue: string;
	onSearchChange: (value: string) => void;
	roleValue: AdminUserRoleFilter;
	onRoleChange: (value: AdminUserRoleFilter) => void;
	statusValue: AdminUserStatusFilter;
	onStatusChange: (value: AdminUserStatusFilter) => void;
	onExport: () => void;
	exporting: boolean;
}

const ROLE_OPTIONS: { value: AdminUserRoleFilter; key: keyof Pick<
	Dictionary["adminUsers"]["toolbar"],
	"roleAll" | "roleAdmin" | "roleEditor" | "roleUser"
> }[] = [
	{ value: "", key: "roleAll" },
	{ value: "ADMIN", key: "roleAdmin" },
	{ value: "EDITOR", key: "roleEditor" },
	{ value: "USER", key: "roleUser" },
];

const STATUS_OPTIONS: { value: AdminUserStatusFilter; key: keyof Pick<
	Dictionary["adminUsers"]["toolbar"],
	"statusAll" | "statusActive" | "statusInactive" | "statusBlocked"
> }[] = [
	{ value: "", key: "statusAll" },
	{ value: "active", key: "statusActive" },
	{ value: "inactive", key: "statusInactive" },
	{ value: "blocked", key: "statusBlocked" },
];

const SELECT_PLACEHOLDER = "__all__";

export const AdminUsersToolbar: FC<AdminUsersToolbarProps> = ({
	dict,
	searchValue,
	onSearchChange,
	roleValue,
	onRoleChange,
	statusValue,
	onStatusChange,
	onExport,
	exporting,
}) => {
	const searchId = useId();

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
		onSearchChange(e.target.value);

	return (
		<div className="flex flex-col gap-3 mb-4 sm:flex-row sm:flex-wrap sm:items-center">
			<div className="relative flex-1 min-w-0 sm:max-w-[360px]">
				<SearchIcon
					className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
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
				value={roleValue === "" ? SELECT_PLACEHOLDER : roleValue}
				onValueChange={(v) =>
					onRoleChange(v === SELECT_PLACEHOLDER ? "" : (v as AdminUserRoleFilter))
				}
			>
				<SelectTrigger
					className="h-[38px] min-w-[140px]"
					aria-label={dict.roleLabel}
				>
					<SelectValue placeholder={dict.roleAll} />
				</SelectTrigger>
				<SelectContent>
					{ROLE_OPTIONS.map((opt) => (
						<SelectItem
							key={opt.value || "all"}
							value={opt.value === "" ? SELECT_PLACEHOLDER : opt.value}
						>
							{dict[opt.key]}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={statusValue === "" ? SELECT_PLACEHOLDER : statusValue}
				onValueChange={(v) =>
					onStatusChange(
						v === SELECT_PLACEHOLDER ? "" : (v as AdminUserStatusFilter),
					)
				}
			>
				<SelectTrigger
					className="h-[38px] min-w-[160px]"
					aria-label={dict.statusLabel}
				>
					<SelectValue placeholder={dict.statusAll} />
				</SelectTrigger>
				<SelectContent>
					{STATUS_OPTIONS.map((opt) => (
						<SelectItem
							key={opt.value || "all"}
							value={opt.value === "" ? SELECT_PLACEHOLDER : opt.value}
						>
							{dict[opt.key]}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Button
				variant="secondary"
				size="md"
				className="sm:ml-auto"
				onClick={onExport}
				disabled={exporting}
				aria-label={dict.exportAriaLabel}
			>
				<DownloadIcon />
				{dict.export}
			</Button>
		</div>
	);
};
