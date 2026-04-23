"use client";

import type { SearchHistoryRecord } from "@/features/search-history";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { SearchIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { type FC, type MouseEvent, useMemo } from "react";
import { formatTime } from "../lib/format-time";

interface HistoryItemProps {
	item: SearchHistoryRecord;
	dict: Dictionary["history"]["item"];
	lang: Locale;
	isRemoving: boolean;
	onRemove: (id: string, query: string) => void;
}

const langBadgeClasses: Record<string, string> = {
	nah: "bg-primary-dim text-primary",
	ru: "bg-warning-dim text-warning",
};

const buildSearchHref = (lang: Locale, query: string): string =>
	`/${lang}/search?q=${encodeURIComponent(query)}`;

export const HistoryItem: FC<HistoryItemProps> = ({
	item,
	dict,
	lang,
	isRemoving,
	onRemove,
}) => {
	const href = useMemo(
		() => buildSearchHref(lang, item.query),
		[lang, item.query],
	);
	const time = useMemo(
		() => formatTime(item.createdAt, lang),
		[item.createdAt, lang],
	);
	const langKey: "nah" | "ru" | "unknown" =
		item.lang === "nah" || item.lang === "ru" ? item.lang : "unknown";
	const badgeClass = langBadgeClasses[langKey] ?? "bg-surface text-faint";
	const badgeLabel =
		langKey === "nah"
			? dict.langNah
			: langKey === "ru"
				? dict.langRu
				: dict.langUnknown;

	const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (isRemoving) return;
		onRemove(item.id, item.query);
	};

	return (
		<Link
			href={href}
			aria-label={dict.openAriaLabel.replace("{query}", item.query)}
			className={cn(
				"group relative flex items-center gap-4 px-4 py-3 rounded-lg",
				"bg-surface border border-edge text-foreground",
				"transition-all duration-150 ease-out",
				"hover:bg-surface-hover hover:border-edge-hover hover:translate-x-1",
				"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
				isRemoving &&
					"pointer-events-none opacity-0 translate-x-10 scale-[0.98] duration-300",
			)}
		>
			<span
				aria-hidden
				className="flex items-center justify-center size-9 shrink-0 rounded-md bg-primary-dim text-primary"
			>
				<SearchIcon className="size-4" />
			</span>

			<div className="flex-1 min-w-0">
				<div className="text-base font-medium text-foreground truncate">
					{item.query}
				</div>
				<div className="flex items-center gap-2 mt-0.5">
					<span
						className={cn(
							"inline-flex items-center px-2 py-0.5 rounded-xs text-xs font-semibold tracking-[0.02em]",
							badgeClass,
						)}
					>
						{badgeLabel}
					</span>
					<span className="text-xs text-faint">{time}</span>
				</div>
			</div>

			<button
				type="button"
				onClick={handleRemove}
				aria-label={dict.removeAriaLabel.replace("{query}", item.query)}
				className={cn(
					"shrink-0 inline-flex items-center justify-center size-8 rounded-sm",
					"bg-transparent border border-transparent text-faint cursor-pointer",
					"transition-colors duration-150",
					"opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100",
					"hover:bg-danger-dim hover:border-danger hover:text-danger",
					"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
				)}
			>
				<XIcon className="size-4" />
			</button>
		</Link>
	);
};
