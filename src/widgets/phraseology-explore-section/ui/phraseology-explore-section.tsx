"use client";

import { usePopularPhraseologyQueries } from "@/entities/dictionary";
import { useSearchHistory } from "@/features/search-history";
import { useAuthStatus, useIsAuthenticated } from "@/shared/lib/auth";
import type { Dictionary } from "@/i18n/dictionaries";
import Link from "next/link";
import { type FC, useEffect, useMemo, useState } from "react";
import { PhraseologyExploreChips } from "./phraseology-explore-chips";
import {
	PhraseologyExploreTabs,
	type PhraseologyExploreTab,
} from "./phraseology-explore-tabs";

interface PhraseologyExploreSectionProps {
	explore: Dictionary["phraseology"]["explore"];
	lang: string;
}

interface ExploreItem {
	expression: string;
	meaning?: string | null;
}

export const PhraseologyExploreSection: FC<PhraseologyExploreSectionProps> = ({
	explore,
	lang,
}) => {
	const [activeTab, setActiveTab] = useState<PhraseologyExploreTab>("popular");
	const isAuthenticated = useIsAuthenticated();
	const authStatus = useAuthStatus();
	const authReady = authStatus === "ready";

	const { popular, fetchPopular } = usePopularPhraseologyQueries();

	useEffect(() => {
		fetchPopular();
	}, [fetchPopular]);

	const historyEnabled = activeTab === "recent" && isAuthenticated;
	const { data: history } = useSearchHistory(
		{ limit: 10, kind: "phraseology" },
		historyEnabled,
	);

	const popularItems = useMemo<readonly ExploreItem[]>(() => {
		const fromApi = (popular ?? [])
			.filter(p => p.query)
			.map(p => ({ expression: p.query, meaning: p.meaning }));
		// Если бэк ещё ничего не накопил — статический фолбэк, чтобы блок не пустовал.
		return fromApi.length > 0 ? fromApi : explore.items;
	}, [popular, explore.items]);

	const recentItems = useMemo<readonly ExploreItem[]>(
		() =>
			historyEnabled
				? (history?.items ?? []).map(r => ({ expression: r.query }))
				: [],
		[historyEnabled, history],
	);

	if (popularItems.length === 0 && isAuthenticated) return null;

	return (
		<section
			aria-labelledby="phraseology-explore-section-heading"
			className="relative mt-16 z-1"
		>
			<h2 id="phraseology-explore-section-heading" className="sr-only">
				{explore.label}
			</h2>

			<PhraseologyExploreTabs
				active={activeTab}
				labels={explore.tabs}
				onChange={setActiveTab}
			/>

			{activeTab === "popular" && (
				<div
					id="phraseology-explore-panel-popular"
					role="tabpanel"
					aria-labelledby="phraseology-explore-tab-popular"
				>
					<PhraseologyExploreChips items={popularItems} lang={lang} />
				</div>
			)}

			{activeTab === "recent" && authReady && (
				<div
					id="phraseology-explore-panel-recent"
					role="tabpanel"
					aria-labelledby="phraseology-explore-tab-recent"
				>
					{!isAuthenticated && (
						<p className="text-sm text-faint">
							{explore.recent.loginCta}{" "}
							<Link
								href={`/${lang}/login`}
								className="text-foreground underline underline-offset-2 hover:text-accent"
							>
								{explore.recent.loginLink}
							</Link>
						</p>
					)}

					{isAuthenticated && recentItems.length > 0 && (
						<PhraseologyExploreChips items={recentItems} lang={lang} />
					)}

					{isAuthenticated && recentItems.length === 0 && (
						<p className="text-sm text-faint">{explore.recent.empty}</p>
					)}
				</div>
			)}
		</section>
	);
};
