"use client";

import type { FavoriteRecord } from "@/features/favorites";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { FC } from "react";
import { FavoriteEntryCard } from "./favorite-entry-card";

interface FavoritesListProps {
	items: readonly FavoriteRecord[];
	dict: Dictionary["favoritesPage"]["item"];
	lang: Locale;
	removingIds: ReadonlySet<number>;
	onRemove: (record: FavoriteRecord) => void;
}

export const FavoritesList: FC<FavoritesListProps> = ({
	items,
	dict,
	lang,
	removingIds,
	onRemove,
}) => (
	<div className="flex flex-col gap-3">
		{items.map(record => (
			<FavoriteEntryCard
				key={record.entryId}
				record={record}
				dict={dict}
				lang={lang}
				isRemoving={removingIds.has(record.entryId)}
				onRemove={onRemove}
			/>
		))}
	</div>
);
