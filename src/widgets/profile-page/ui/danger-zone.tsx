"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import type { FC } from "react";

interface DangerZoneProps {
	dict: Dictionary["profile"]["settings"];
	onDelete: () => void;
}

export const DangerZone: FC<DangerZoneProps> = ({ dict, onDelete }) => (
	<section>
		<h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4 pb-2 border-b border-edge">
			{dict.dangerTitle}
		</h2>
		<div className="border border-danger/25 rounded-lg p-5">
			<div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
				<div className="flex-1">
					<div className="text-sm">{dict.deleteAccount}</div>
					<div className="text-xs text-muted mt-0.5">
						{dict.deleteAccountDesc}
					</div>
				</div>
				<Button
					variant="danger"
					size="sm"
					onClick={onDelete}
					className="max-sm:w-full"
				>
					{dict.deleteButton}
				</Button>
			</div>
		</div>
	</section>
);
