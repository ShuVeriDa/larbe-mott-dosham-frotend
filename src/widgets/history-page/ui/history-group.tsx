"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { FC } from "react";
import type { HistoryDateGroup } from "../model/group-by-date";
import { HistoryItem } from "./history-item";

interface HistoryGroupProps {
	group: HistoryDateGroup;
	itemDict: Dictionary["history"]["item"];
	lang: Locale;
	removingIds: ReadonlySet<string>;
	onRemove: (id: string, query: string) => void;
}

export const HistoryGroup: FC<HistoryGroupProps> = ({
	group,
	itemDict,
	lang,
	removingIds,
	onRemove,
}) => (
	<section className="mb-6" aria-label={group.label}>
		<h2 className="text-xs font-semibold text-muted uppercase tracking-[0.06em] pb-2 mb-3 border-b border-edge">
			{group.label}
		</h2>
		<ul className="flex flex-col gap-2">
			{group.items.map(item => (
				<li key={item.id}>
					<HistoryItem
						item={item}
						dict={itemDict}
						lang={lang}
						isRemoving={removingIds.has(item.id)}
						onRemove={onRemove}
					/>
				</li>
			))}
		</ul>
	</section>
);
