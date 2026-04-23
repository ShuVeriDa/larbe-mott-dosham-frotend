"use client";

import type { AdminUserListItem } from "@/features/admin-users";
import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import { BanIcon, CheckCircle2Icon, PencilIcon } from "lucide-react";
import type { FC } from "react";

interface AdminUsersRowActionsProps {
	user: AdminUserListItem;
	dict: Dictionary["adminUsers"]["table"];
	onEdit: (user: AdminUserListItem) => void;
	onToggleBlock: (user: AdminUserListItem) => void;
	disabled?: boolean;
	variant?: "icons" | "buttons";
}

export const AdminUsersRowActions: FC<AdminUsersRowActionsProps> = ({
	user,
	dict,
	onEdit,
	onToggleBlock,
	disabled,
	variant = "icons",
}) => {
	const blocked = user.status === "blocked";

	if (variant === "buttons") {
		return (
			<div className="flex gap-2 mt-3 pt-3 border-t border-border">
				<Button
					variant="secondary"
					size="sm"
					className="flex-1"
					onClick={() => onEdit(user)}
					disabled={disabled}
				>
					<PencilIcon className="size-3.5" />
					{dict.editLabel}
				</Button>
				<Button
					variant={blocked ? "secondary" : "danger"}
					size="sm"
					className="flex-1"
					onClick={() => onToggleBlock(user)}
					disabled={disabled}
				>
					{blocked ? (
						<CheckCircle2Icon className="size-3.5" />
					) : (
						<BanIcon className="size-3.5" />
					)}
					{blocked ? dict.unblockLabel : dict.blockLabel}
				</Button>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-1 justify-end">
			<Button
				variant="ghost"
				size="icon-sm"
				onClick={() => onEdit(user)}
				disabled={disabled}
				aria-label={dict.editAria.replace("{name}", user.name)}
				title={dict.editLabel}
			>
				<PencilIcon />
			</Button>
			<Button
				variant="ghost"
				size="icon-sm"
				className={blocked ? "" : "hover:bg-red-500/10 hover:text-red-500"}
				onClick={() => onToggleBlock(user)}
				disabled={disabled}
				aria-label={(blocked ? dict.unblockAria : dict.blockAria).replace(
					"{name}",
					user.name,
				)}
				title={blocked ? dict.unblockLabel : dict.blockLabel}
			>
				{blocked ? <CheckCircle2Icon /> : <BanIcon />}
			</Button>
		</div>
	);
};
