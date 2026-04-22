"use client";

import {
	useFavoritesSessionStore,
	useIsFavorited,
	useToggleFavorite,
} from "@/features/favorites";
import { cn } from "@/shared/lib";
import { useIsAuthenticated } from "@/shared/lib/auth";
import { useParams, useRouter } from "next/navigation";
import { type FC, useCallback } from "react";

interface FavoriteToggleProps {
	entryId: number;
	labelAdd: string;
	labelRemove: string;
}

export const FavoriteToggle: FC<FavoriteToggleProps> = ({
	entryId,
	labelAdd,
	labelRemove,
}) => {
	const router = useRouter();
	const params = useParams<{ lang: string }>();
	const isAuthenticated = useIsAuthenticated();
	const isFavorited = useIsFavorited(entryId);
	const setFavorited = useFavoritesSessionStore(s => s.setFavorited);
	const { mutate, isPending } = useToggleFavorite();

	const handleClick = useCallback(() => {
		if (!isAuthenticated) {
			router.push(`/${params.lang}/login`);
			return;
		}
		const next = !isFavorited;
		setFavorited(entryId, next);
		mutate(entryId, {
			onError: () => setFavorited(entryId, !next),
			onSuccess: data => setFavorited(entryId, data.favorited),
		});
	}, [isAuthenticated, isFavorited, entryId, mutate, router, params.lang, setFavorited]);

	return (
		<button
			type="button"
			onClick={handleClick}
			disabled={isPending}
			aria-pressed={isFavorited}
			className={cn(
				"inline-flex items-center justify-center gap-2 h-8 px-4 text-sm rounded-md border transition",
				isFavorited
					? "border-warning text-warning bg-warning-dim"
					: "border-edge text-muted bg-surface hover:border-warning hover:text-warning",
				isPending && "opacity-60 cursor-wait",
			)}
		>
			<span aria-hidden>{isFavorited ? "★" : "☆"}</span>
			{isFavorited ? labelRemove : labelAdd}
		</button>
	);
};
