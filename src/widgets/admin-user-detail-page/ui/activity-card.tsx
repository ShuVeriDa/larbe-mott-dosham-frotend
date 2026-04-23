import type { AdminUserActivityItem } from "@/features/admin-users";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { ACTIVITY_ICON, ACTIVITY_TONE } from "../lib/activity";
import { formatDateTime, maskIp } from "../lib/format";
import { parseUserAgent } from "../lib/user-agent";

interface ActivityCardProps {
	items: AdminUserActivityItem[];
	isLoading: boolean;
	lang: Locale;
	dict: Dictionary["adminUserDetail"]["activity"];
}

const renderItemText = (
	item: AdminUserActivityItem,
	dict: Dictionary["adminUserDetail"]["activity"],
) => {
	switch (item.type) {
		case "login": {
			const ua = parseUserAgent(item.meta.ua);
			return (
				<>
					<strong className="text-foreground font-semibold">
						{dict.types.login}
					</strong>
					<br />
					<span className="text-xs text-muted-foreground">
						IP: {maskIp(item.meta.ip)} · {ua.label}
					</span>
				</>
			);
		}
		case "edit":
			return (
				<>
					<strong className="text-foreground font-semibold">
						{dict.types.edit}
					</strong>{" "}
					{dict.entry}{" "}
					<strong className="text-primary">«{item.meta.word}»</strong>
					{item.meta.action ? ` — ${item.meta.action}` : null}
				</>
			);
		case "favorite":
			return (
				<>
					<strong className="text-foreground font-semibold">
						{dict.types.favorite}
					</strong>{" "}
					{dict.entry}{" "}
					<strong className="text-primary">«{item.meta.word}»</strong>
				</>
			);
		case "suggestion":
			return (
				<>
					<strong className="text-foreground font-semibold">
						{dict.types.suggestion}
					</strong>{" "}
					{dict.forEntry}{" "}
					<strong className="text-primary">«{item.meta.word}»</strong>
				</>
			);
		case "ban":
			return (
				<strong className="text-foreground font-semibold">
					{dict.types.ban}
				</strong>
			);
		default:
			return null;
	}
};

export const ActivityCard: FC<ActivityCardProps> = ({
	items,
	isLoading,
	lang,
	dict,
}) => (
	<section className="rounded-lg border border-border bg-surface overflow-hidden mb-6">
		<div className="px-5 py-4 border-b border-border">
			<h2 className="text-sm font-semibold text-foreground">{dict.title}</h2>
		</div>
		<div className="px-5 py-3">
			{isLoading ? (
				<ul className="flex flex-col gap-3" aria-busy>
					{[0, 1, 2, 3].map((i) => (
						<li key={i} className="flex gap-3 items-start animate-pulse">
							<div className="size-8 rounded-full bg-surface-active shrink-0" />
							<div className="flex-1 flex flex-col gap-2">
								<div className="h-3 w-2/3 bg-surface-active rounded-sm" />
								<div className="h-2.5 w-1/3 bg-surface-active rounded-sm" />
							</div>
						</li>
					))}
				</ul>
			) : items.length === 0 ? (
				<p className="py-6 text-center text-sm text-muted-foreground">
					{dict.empty}
				</p>
			) : (
				<ul className="list-none">
					{items.map((item, idx) => (
						<li
							key={`${item.type}-${item.at}-${idx}`}
							className="flex gap-3 py-3 border-b border-border last:border-b-0 items-start"
						>
							<div
								aria-hidden
								className={cn(
									"size-8 rounded-full flex items-center justify-center text-sm shrink-0",
									ACTIVITY_TONE[item.type],
								)}
							>
								{ACTIVITY_ICON[item.type]}
							</div>
							<div className="flex-1 text-sm text-muted-foreground leading-relaxed min-w-0">
								{renderItemText(item, dict)}
							</div>
							<time
								dateTime={item.at}
								className="text-xs text-muted-foreground shrink-0 whitespace-nowrap mt-0.5"
							>
								{formatDateTime(item.at, lang)}
							</time>
						</li>
					))}
				</ul>
			)}
		</div>
	</section>
);
