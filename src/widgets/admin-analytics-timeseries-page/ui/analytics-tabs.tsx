"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { FC } from "react";

interface AnalyticsTabsProps {
	lang: Locale;
	dict: Dictionary["admin"]["analytics"]["tabs"];
	activeKey: keyof Dictionary["admin"]["analytics"]["tabs"];
}

const TAB_DEFS: ReadonlyArray<{
	key: keyof Dictionary["admin"]["analytics"]["tabs"];
	suffix: string;
	icon: string;
}> = [
	{ key: "overview", suffix: "", icon: "📊" },
	{ key: "timeseries", suffix: "/timeseries", icon: "📈" },
	{ key: "pages", suffix: "/pages", icon: "📄" },
	{ key: "searchQueries", suffix: "/search-queries", icon: "🔍" },
	{ key: "referrers", suffix: "/referrers", icon: "🌐" },
	{ key: "devices", suffix: "/devices", icon: "💻" },
	{ key: "geography", suffix: "/geography", icon: "🗺️" },
	{ key: "live", suffix: "/live", icon: "⚡" },
];

export const AnalyticsTabs: FC<AnalyticsTabsProps> = ({
	lang,
	dict,
	activeKey,
}) => {
	const searchParams = useSearchParams();
	const qs = searchParams.toString();

	return (
		<nav
			aria-label={dict.overview}
			className="flex gap-1 border-b border-[var(--border)] mb-6 overflow-x-auto"
		>
			{TAB_DEFS.map((tab) => {
				const href = `/${lang}/admin/analytics${tab.suffix}${
					qs ? `?${qs}` : ""
				}`;
				const isActive = tab.key === activeKey;
				return (
					<Link
						key={tab.key}
						href={href}
						aria-current={isActive ? "page" : undefined}
						className={cn(
							"inline-flex items-center gap-2 px-4 py-3 text-sm font-medium",
							"border-b-2 -mb-px whitespace-nowrap transition-colors",
							isActive
								? "text-[var(--accent)] border-[var(--accent)]"
								: "text-[var(--text-muted)] border-transparent hover:text-[var(--text)]",
						)}
					>
						<span aria-hidden="true">{tab.icon}</span>
						{dict[tab.key]}
					</Link>
				);
			})}
		</nav>
	);
};
