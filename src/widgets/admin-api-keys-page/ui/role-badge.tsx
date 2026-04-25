import type { ApiKeyRoleApi } from "@/features/admin-api-keys";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { API_TO_UI_ROLE } from "../lib/format";

interface RoleBadgeProps {
	role: ApiKeyRoleApi;
	dict: Dictionary["admin"]["apiKeys"]["roles"];
}

const ROLE_CLASS: Record<ApiKeyRoleApi, string> = {
	ADMIN: "bg-[var(--danger-dim)] text-[var(--danger)]",
	EDITOR: "bg-[var(--warning-dim)] text-[var(--warning)]",
	USER: "bg-[var(--info-dim)] text-[var(--info)]",
};

export const RoleBadge: FC<RoleBadgeProps> = ({ role, dict }) => {
	const uiRole = API_TO_UI_ROLE[role];
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 text-[0.65rem] font-semibold px-2 py-0.5 rounded-full tracking-wide whitespace-nowrap",
				ROLE_CLASS[role],
			)}
		>
			{dict[uiRole]}
		</span>
	);
};
