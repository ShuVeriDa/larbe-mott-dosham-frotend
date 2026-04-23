"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import type { FC } from "react";

interface AdminUsersErrorProps {
	dict: Dictionary["adminUsers"]["error"];
	onRetry: () => void;
}

export const AdminUsersError: FC<AdminUsersErrorProps> = ({ dict, onRetry }) => (
	<div
		role="alert"
		className="text-center py-12 px-6 bg-surface border border-border rounded-xl"
	>
		<h2 className="text-lg font-semibold text-foreground mb-2">{dict.title}</h2>
		<p className="max-w-sm mx-auto mb-6 text-base text-muted-foreground">
			{dict.text}
		</p>
		<Button variant="outline" size="sm" onClick={onRetry}>
			{dict.retry}
		</Button>
	</div>
);
