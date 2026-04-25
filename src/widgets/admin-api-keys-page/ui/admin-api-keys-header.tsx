"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import { PlusIcon } from "lucide-react";
import type { FC } from "react";

interface AdminApiKeysHeaderProps {
	dict: Dictionary["admin"]["apiKeys"]["header"];
	onCreate: () => void;
}

export const AdminApiKeysHeader: FC<AdminApiKeysHeaderProps> = ({
	dict,
	onCreate,
}) => (
	<header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
		<div>
			<h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mb-1">
				{dict.title}
			</h1>
			<p className="text-base text-[var(--text-secondary)] max-w-xl">
				{dict.subtitle}
			</p>
		</div>
		<Button variant="primary" size="md" onClick={onCreate}>
			<PlusIcon />
			{dict.create.replace(/^\+\s*/, "")}
		</Button>
	</header>
);
