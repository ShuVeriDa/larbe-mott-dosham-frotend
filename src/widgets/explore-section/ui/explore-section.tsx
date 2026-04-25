"use client";

import { usePopularQueries } from "@/entities/dictionary";
import { useSearchHistory } from "@/features/search-history";
import { useAuthStatus, useIsAuthenticated } from "@/shared/lib/auth";
import type { Dictionary } from "@/i18n/dictionaries";
import Link from "next/link";
import { type FC, useEffect, useMemo, useState } from "react";
import { ExploreChips } from "./explore-chips";
import { ExploreTabs, type ExploreTab } from "./explore-tabs";

interface IExploreSectionProps {
	popularWords: Dictionary["popularWords"];
	lang: string;
}

export const ExploreSection: FC<IExploreSectionProps> = ({
	popularWords,
	lang,
}) => {
	const [activeTab, setActiveTab] = useState<ExploreTab>("popular");
	const isAuthenticated = useIsAuthenticated();
	const authStatus = useAuthStatus();
	const authReady = authStatus === "ready";

	const { popular, fetchPopular } = usePopularQueries();

	useEffect(() => {
		fetchPopular();
	}, [fetchPopular]);

	const historyEnabled = activeTab === "recent" && isAuthenticated;
	const { data: history } = useSearchHistory({ limit: 10 }, historyEnabled);

	const popularItems = useMemo(
		() =>
			(popular ?? [])
				.filter(p => p.query)
				.map(p => ({ word: p.query, hint: p.meaning ?? undefined })),
		[popular],
	);

	const recentItems = useMemo(
		() =>
			historyEnabled
				? (history?.items ?? []).map(r => ({ word: r.query }))
				: [],
		[historyEnabled, history],
	);

	// Hide the whole block only when there is nothing to show and nothing
	// actionable on any tab — i.e. popular is empty AND the user is logged in.
	// Unauthenticated users still see the CTA on the recent tab.
	if (popularItems.length === 0 && isAuthenticated) return null;

	return (
		<section
			aria-labelledby="explore-section-heading"
			className="relative mt-16 z-1"
		>
			<h2
				id="explore-section-heading"
				className="sr-only"
			>
				{popularWords.label}
			</h2>

			<ExploreTabs
				active={activeTab}
				labels={popularWords.tabs}
				onChange={setActiveTab}
			/>

			{activeTab === "popular" && (
				<div
					id="explore-panel-popular"
					role="tabpanel"
					aria-labelledby="explore-tab-popular"
				>
					<ExploreChips items={popularItems} lang={lang} />
				</div>
			)}

			{activeTab === "recent" && authReady && (
				<div
					id="explore-panel-recent"
					role="tabpanel"
					aria-labelledby="explore-tab-recent"
				>
					{!isAuthenticated && (
						<p className="text-sm text-faint">
							{popularWords.recent.loginCta}{" "}
							<Link
								href={`/${lang}/login`}
								className="text-foreground underline underline-offset-2 hover:text-accent"
							>
								{popularWords.recent.loginLink}
							</Link>
						</p>
					)}

					{isAuthenticated && recentItems.length > 0 && (
						<ExploreChips items={recentItems} lang={lang} />
					)}

					{isAuthenticated && recentItems.length === 0 && (
						<p className="text-sm text-faint">{popularWords.recent.empty}</p>
					)}
				</div>
			)}
		</section>
	);
};
