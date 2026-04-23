"use client";

import { FavoriteButton } from "@/features/favorites";
import type { Dictionary } from "@/i18n/dictionaries";
import { Button, Typography } from "@/shared/ui";
import Link from "next/link";
import { type FC, useCallback, useState } from "react";

interface RandomCardActionsProps {
	labels: Dictionary["random"]["card"];
	entryId: number;
	lang: string;
}

const SHARE_FEEDBACK_MS = 1200;

export const RandomCardActions: FC<RandomCardActionsProps> = ({
	labels,
	entryId,
	lang,
}) => {
	const [shareState, setShareState] = useState<"idle" | "success" | "error">(
		"idle",
	);

	const handleShare = useCallback(async () => {
		const url = `${window.location.origin}/${lang}/entry/${entryId}`;
		try {
			await navigator.clipboard.writeText(url);
			setShareState("success");
		} catch {
			setShareState("error");
		}
		window.setTimeout(() => setShareState("idle"), SHARE_FEEDBACK_MS);
	}, [entryId, lang]);

	const shareAriaLabel =
		shareState === "success"
			? labels.shareSuccess
			: shareState === "error"
				? labels.shareError
				: labels.share;

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
					className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-edge bg-surface hover:bg-[var(--surface-hover)] hover:text-foreground"
				/>
				<button
					type="button"
					onClick={handleShare}
					aria-label={shareAriaLabel}
					title={shareAriaLabel}
					className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-edge bg-surface text-muted hover:bg-[var(--surface-hover)] hover:text-foreground transition-colors"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						aria-hidden="true"
					>
						<title>{shareAriaLabel}</title>
						<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
						<polyline points="16 6 12 2 8 6" />
						<line x1="12" y1="2" x2="12" y2="15" />
					</svg>
				</button>
			</div>
		</div>
	);
};
