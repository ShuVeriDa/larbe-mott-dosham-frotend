import { useFavoritesSessionStore } from "./favorites-session-store";

export const useIsFavorited = (entryId: number): boolean =>
	useFavoritesSessionStore(s => s.ids.includes(entryId));
