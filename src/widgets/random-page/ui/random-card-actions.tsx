"use client";

import { FavoriteButton } from "@/features/favorites";
import type { Dictionary } from "@/i18n/dictionaries";
import { Button, Typography } from "@/shared/ui";
import Link from "next/link";
import { Link2 } from "lucide-react";
import { type FC, useCallback } from "react";
import { toast } from "sonner";

interface RandomCardActionsProps {
	labels: Dictionary["random"]["card"];
	entryId: number;
	lang: string;
}

export const RandomCardActions: FC<RandomCardActionsProps> = ({
	labels,
	entryId,
	lang,
}) => {
	const handleShare = useCallback(async () => {
		const url = `${window.location.origin}/${lang}/entry/${entryId}`;
		try {
			await navigator.clipboard.writeText(url);
			toast.success(labels.shareSuccess, { description: labels.shareSuccessDescription });
		} catch {
			toast.error(labels.shareError);
		}
	}, [entryId, lang, labels]);

	return (
		<div className="flex flex-wrap items-center gap-3 pt-5 border-t border-edge">
			<Button variant="outline" size="sm" asChild>
				<Link href={`/${lang}/entry/${entryId}`}>
					<Typography tag="span">{labels.openCard}</Typography>
				</Link>
			</Button>

			<div className="flex gap-2 sm:ml-auto">
				<FavoriteButton
					entryId={entryId}
					label={labels.favoriteAdd}
					className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-edge bg-surface hover:bg-surface-hover hover:text-foreground"
				/>
				<button
					type="button"
					onClick={handleShare}
					aria-label={labels.share}
					title={labels.share}
					className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-edge bg-surface text-muted hover:bg-surface-hover hover:text-foreground transition-colors"
				>
					<Link2 size={16} aria-hidden="true" />
				</button>
			</div>
		</div>
	);
};
