"use client";

import type { WordLevel } from "@/entities/dictionary";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	Typography,
} from "@/shared/ui";
import type { FC } from "react";

const LEVEL_CLASSES: Record<WordLevel, string> = {
	A: "bg-level-a-bg text-level-a",
	B: "bg-level-b-bg text-level-b",
	C: "bg-level-c-bg text-level-c",
};

const UNATTESTED_CLASS =
	"bg-muted/30 text-muted-foreground border border-dashed border-muted-foreground/30";

type LevelKey = WordLevel | "unattested";

export interface WordLevelBadgeContent {
	badge: Record<LevelKey, string>;
	label: Record<LevelKey, string>;
	description: Record<LevelKey, string>;
	disclaimer: {
		title: string;
		body: string;
	};
}

interface WordLevelBadgeProps {
	wordLevel?: WordLevel | null;
	attested?: boolean;
	content: WordLevelBadgeContent;
	/** Переопределение короткой подписи на бейдже (по умолчанию — буква уровня). */
	label?: string;
	className?: string;
}

/**
 * Бейдж уровня слова (A/B/C) с tooltip-объяснением.
 *
 * Поведение:
 *  - Если известен wordLevel → показывает букву с цветной заливкой.
 *  - Если attested === false или wordLevel отсутствует → показывает бейдж "?"
 *    с пометкой "уровень не определён".
 *  - В tooltip — человекочитаемое название уровня, пояснение, и дисклеймер
 *    о том, что оценка приблизительная и корпус расширяется.
 */
export const WordLevelBadge: FC<WordLevelBadgeProps> = ({
	wordLevel,
	attested,
	content,
	label,
	className,
}) => {
	// Определяем режим: известный уровень vs "не определён"
	const isUnattested = attested === false || !wordLevel;
	const key: LevelKey = isUnattested ? "unattested" : wordLevel;

	const colorClass = isUnattested
		? UNATTESTED_CLASS
		: LEVEL_CLASSES[wordLevel];

	const badgeText = label ?? content.badge[key];

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					type="button"
					aria-label={content.label[key]}
					className={`cursor-help inline-flex items-center font-semibold py-0.5 px-2 rounded-xs text-xs tracking-[0.02em] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${colorClass} ${className ?? ""}`}
				>
					{badgeText}
				</button>
			</TooltipTrigger>
			<TooltipContent side="top" className="max-w-xs">
				<div className="flex flex-col gap-2 p-1 text-left">
					<div>
						<Typography
							tag="span"
							className="block text-sm font-semibold text-foreground mb-1"
						>
							{content.label[key]}
						</Typography>
						<Typography
							tag="p"
							className="text-xs leading-relaxed text-muted-foreground"
						>
							{content.description[key]}
						</Typography>
					</div>
					<div className="border-t border-border pt-2">
						<Typography
							tag="span"
							className="block text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground/70 mb-1"
						>
							{content.disclaimer.title}
						</Typography>
						<Typography
							tag="p"
							className="text-xs leading-relaxed text-muted-foreground"
						>
							{content.disclaimer.body}
						</Typography>
					</div>
				</div>
			</TooltipContent>
		</Tooltip>
	);
};
