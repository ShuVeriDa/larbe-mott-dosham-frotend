import type { RoleName } from "@/entities/user";
import type { Dictionary } from "@/i18n/dictionaries";
import { Badge } from "@/shared/ui";
import type { FC } from "react";

interface RoleBadgeProps {
	role: RoleName;
	dict: Dictionary["adminUsers"]["roles"];
}

const ROLE_VARIANT: Record<RoleName, "danger" | "warning" | "secondary"> = {
	ADMIN: "danger",
	EDITOR: "warning",
	USER: "secondary",
};

export const RoleBadge: FC<RoleBadgeProps> = ({ role, dict }) => (
	<Badge variant={ROLE_VARIANT[role]} className="font-mono">
		{dict[role]}
	</Badge>
);
