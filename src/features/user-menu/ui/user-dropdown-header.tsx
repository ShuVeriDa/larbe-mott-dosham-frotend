import type { RoleName } from "@/entities/user";
import type { FC } from "react";
import { UserAvatar } from "./user-avatar";
import { UserRoleBadge } from "./user-role-badge";

interface UserDropdownHeaderProps {
	initials: string;
	name: string;
	email: string;
	role: RoleName;
}

export const UserDropdownHeader: FC<UserDropdownHeaderProps> = ({
	initials,
	name,
	email,
	role,
}) => (
	<div className="relative flex items-center gap-3 px-4 pt-4 pb-3 border-b border-edge">
		<span
			aria-hidden="true"
			className="absolute top-0 left-0 right-0 h-0.5 opacity-60 bg-gradient-to-r from-primary to-transparent"
		/>
		<UserAvatar initials={initials} size="md" />
		<div className="flex-1 min-w-0">
			<div className="flex items-center gap-2 text-sm font-semibold text-foreground overflow-hidden">
				<span className="truncate">{name}</span>
				{role !== "USER" && <UserRoleBadge role={role} />}
			</div>
			<div className="mt-0.5 text-xs text-muted truncate">{email}</div>
		</div>
	</div>
);
