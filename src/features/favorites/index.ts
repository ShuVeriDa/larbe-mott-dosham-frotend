export type {
  FavoriteEntry,
  FavoriteToggleResult,
  FavoriteCheckResult,
} from "./types";

export { favoritesApi } from "./api";

export {
  favoritesKeys,
  useFavorites,
  useFavoriteCheck,
  useToggleFavorite,
  useClearFavorites,
} from "./queries";
