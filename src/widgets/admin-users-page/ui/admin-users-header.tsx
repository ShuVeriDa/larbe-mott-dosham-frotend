import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";

interface AdminUsersHeaderProps {
	dict: Dictionary["adminUsers"]["header"];
}

export const AdminUsersHeader: FC<AdminUsersHeaderProps> = ({ dict }) => (
	<header className="mb-8">
		<h1 className="text-2xl font-bold tracking-tight text-foreground">
			{dict.title}
		</h1>
		<p className="text-base text-muted-foreground mt-1 max-w-xl">
			{dict.subtitle}
		</p>
	</header>
);
