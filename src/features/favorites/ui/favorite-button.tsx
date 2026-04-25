"use client";

import { cn } from "@/shared/lib";
import { useIsAuthenticated } from "@/shared/lib/auth";
import { useParams, useRouter } from "next/navigation";
import { type FC, useCallback } from "react";
import { useFavoritesSessionStore } from "../lib/favorites-session-store";
import { useIsFavorited } from "../lib/use-is-favorited";
import { useToggleFavorite } from "../queries";

interface FavoriteButtonProps {
	entryId: number;
	label: string;
	className?: string;
}

export const FavoriteButton: FC<FavoriteButtonProps> = ({
	entryId,
	label,
	className,
}) => {
	const router = useRouter();
	const params = useParams<{ lang: string }>();
	const isAuthenticated = useIsAuthenticated();
	const isFavorited = useIsFavorited(entryId);
	const setFavorited = useFavoritesSessionStore(s => s.setFavorited);
	const { mutate, isPending } = useToggleFavorite();

	const handleClick = useCallback(
		() => {
			if (!isAuthenticated) {
				router.push(`/${params.lang}/login`);
				return;
			}

			const next = !isFavorited;
			setFavorited(entryId, next);

			mutate(entryId, {
				onError: () => {
					// Revert the optimistic update on failure.
					setFavorited(entryId, !next);
				},
				onSuccess: data => {
					// Sync with authoritative server state (handles races).
					setFavorited(entryId, data.favorited);
				},
			});
		},
		[
			isAuthenticated,
			isFavorited,
			entryId,
			mutate,
			router,
			params.lang,
			setFavorited,
		],
	);

	return (
		<button
			type="button"
			onClick={handleClick}
			disabled={isPending}
			aria-label={label}
			title={label}
			aria-pressed={isFavorited}
			className={cn(
				"text-base leading-none transition-colors",
				isFavorited ? "text-accent" : "text-faint hover:text-foreground",
				isPending && "opacity-50 cursor-wait",
				className,
			)}
		>
			{isFavorited ? "★" : "☆"}
		</button>
	);
};
