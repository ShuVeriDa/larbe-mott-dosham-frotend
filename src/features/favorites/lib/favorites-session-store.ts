import { create, createJSONStorage, devtools, persist } from "@/shared/lib";

interface FavoritesSessionState {
	ids: number[];
	setFavorited: (entryId: number, favorited: boolean) => void;
	clear: () => void;
}

/**
 * Session-scoped cache of favorite entry IDs.
 *
 * Backend has no batch `/check` endpoint yet, so on page load we start with a
 * blank state — stars render empty until the user interacts. After a toggle
 * we persist the result here so the star survives a page reload within the
 * same tab, without hammering N `/check` requests per search result page.
 */
export const useFavoritesSessionStore = create<FavoritesSessionState>()(
	devtools(
		persist(
			set => ({
				ids: [],
				setFavorited: (entryId, favorited) =>
					set(
						state => {
							const has = state.ids.includes(entryId);
							if (favorited && !has) return { ids: [...state.ids, entryId] };
							if (!favorited && has)
								return { ids: state.ids.filter(id => id !== entryId) };
							return state;
						},
						false,
						"setFavorited",
					),
				clear: () => set({ ids: [] }, false, "clear"),
			}),
			{
				name: "favorites-session:v1",
				storage: createJSONStorage(() => sessionStorage),
			},
		),
		{ name: "FavoritesSessionStore" },
	),
);
