"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { AdminErrorState } from "@/shared/ui/admin";
import { cn } from "@/shared/lib";
import {
	AnalyticsTabs,
	AnalyticsToolbar,
	RealtimeBadge,
} from "@/widgets/admin-analytics-overview-page";
import type { FC, ReactNode } from "react";
import { toast } from "sonner";
import { useGeographyPage } from "../model/use-geography-page";
import { CitiesTable } from "./cities-table";
import { CountriesTable } from "./countries-table";
import { GeoIpSetupNotice } from "./geoip-setup-notice";
import { GeoIpSetupSteps } from "./geoip-setup-steps";
import { GeoIpStatusBadge } from "./geoip-status-badge";
import { GeoPreviewPanel } from "./geo-preview-panel";
import { GeographyStatsGrid } from "./geography-stats-grid";
import { WorldChoropleth } from "./world-choropleth";

interface AdminAnalyticsGeographyPageProps {
	lang: Locale;
	analyticsDict: Dictionary["admin"]["analytics"];
	dict: Dictionary["admin"]["analytics"]["geography"];
	commonDict: Dictionary["admin"]["common"];
}

const InlineCode: FC<{ children: ReactNode }> = ({ children }) => (
	<code className="font-mono text-[0.85em] bg-[var(--surface-active)] px-[6px] py-[1px] rounded-sm">
		{children}
	</code>
);

const renderSubtitle = (template: string): ReactNode[] => {
	const parts = template.split(/\{(\w+)\}/g);
	return parts.map((part, idx) => {
		if (idx % 2 === 1 && part === "field") {
			return <InlineCode key={idx}>country</InlineCode>;
		}
		if (idx % 2 === 1) {
			return <span key={idx}>{`{${part}}`}</span>;
		}
		return <span key={idx}>{part}</span>;
	});
};

export const AdminAnalyticsGeographyPage: FC<
	AdminAnalyticsGeographyPageProps
> = ({ lang, analyticsDict, dict, commonDict }) => {
	const page = useGeographyPage();

	const handleRefresh = async () => {
		try {
			await page.refresh();
			toast.success(dict.toasts.refreshed);
		} catch {
			toast.error(dict.toasts.refreshError);
		}
	};

	const handleExportCountries = async () => {
		try {
			await page.exportCountries();
		} catch {
			toast.error(dict.toasts.exportError);
		}
	};

	const handleExportCities = async () => {
		try {
			await page.exportCities();
		} catch {
			toast.error(dict.toasts.exportError);
		}
	};

	const isStatusLoading = page.statusQuery.isLoading;
	const statusError = page.statusQuery.isError;

	const countriesItems = page.countriesQuery.data ?? [];
	const citiesItems = page.citiesQuery.data ?? [];

	return (
		<article className="max-w-[1280px] mx-auto">
			<header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
				<div>
					<h1 className="text-2xl font-bold text-[var(--text)] tracking-tight mb-1 flex items-center gap-3 flex-wrap">
						<span>{dict.header.title}</span>
						<GeoIpStatusBadge
							dict={dict.header}
							configured={page.configured}
							loading={isStatusLoading}
						/>
					</h1>
					<p className="text-base text-[var(--text-secondary)] max-w-2xl">
						{renderSubtitle(dict.header.subtitle)}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<RealtimeBadge
						label={analyticsDict.realtime.label}
						tooltip={analyticsDict.realtime.tooltip}
					/>
				</div>
			</header>

			<AnalyticsTabs
				lang={lang}
				dict={analyticsDict.tabs}
				activeKey="geography"
			/>

			<AnalyticsToolbar
				dict={analyticsDict.toolbar}
				rangeState={page.range}
				onRefresh={handleRefresh}
				onExport={page.configured ? handleExportCountries : undefined}
				refreshing={
					page.refreshing ||
					page.countriesQuery.isFetching ||
					page.citiesQuery.isFetching
				}
				exporting={page.isExportingCountries}
			/>

			{statusError ? (
				<AdminErrorState
					title={dict.errors.statusTitle}
					retryLabel={commonDict.retry}
					onRetry={() => page.statusQuery.refetch()}
					className="mb-6"
				/>
			) : null}

			{!page.configured ? (
				<>
					<GeoIpSetupNotice dict={dict.notice} />
					<GeoIpSetupSteps dict={dict.setup} />
					<GeoPreviewPanel
						dict={dict.preview}
						mapDict={dict.map}
						lang={lang}
					/>
					<div className="flex justify-end mb-6">
						<button
							type="button"
							onClick={() => {
								toast(dict.toasts.recheck);
								void page.recheck();
							}}
							className={cn(
								"inline-flex items-center gap-2 px-3 h-8 rounded-md",
								"bg-[var(--surface)] border border-[var(--border)]",
								"text-xs font-semibold text-[var(--text)]",
								"hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] transition-colors",
							)}
						>
							↻ {dict.actions.recheck}
						</button>
					</div>
				</>
			) : (
				<>
					{page.statsQuery.isError ? (
						<AdminErrorState
							title={dict.errors.statsTitle}
							retryLabel={commonDict.retry}
							onRetry={() => page.statsQuery.refetch()}
							className="mb-6"
						/>
					) : (
						<GeographyStatsGrid
							dict={dict.stats}
							lang={lang}
							data={page.statsQuery.data}
							loading={page.statsQuery.isLoading}
						/>
					)}

					{page.countriesQuery.isError ? (
						<AdminErrorState
							title={dict.errors.countriesTitle}
							retryLabel={commonDict.retry}
							onRetry={() => page.countriesQuery.refetch()}
							className="mb-6"
						/>
					) : (
						<>
							<WorldChoropleth
								dict={dict.map}
								lang={lang}
								items={countriesItems}
								loading={page.countriesQuery.isLoading}
							/>
							<CountriesTable
								dict={dict.countries}
								lang={lang}
								items={countriesItems}
								activeIso={page.countryFilter}
								onSelect={page.setCountryFilter}
								loading={page.countriesQuery.isLoading}
							/>
						</>
					)}

					{page.citiesQuery.isError ? (
						<AdminErrorState
							title={dict.errors.citiesTitle}
							retryLabel={commonDict.retry}
							onRetry={() => page.citiesQuery.refetch()}
							className="mb-6"
						/>
					) : (
						<>
							<div className="flex justify-end mb-3">
								<button
									type="button"
									onClick={handleExportCities}
									disabled={page.isExportingCities}
									className={cn(
										"inline-flex items-center gap-2 px-3 h-8 rounded-md",
										"bg-[var(--surface)] border border-[var(--border)]",
										"text-xs font-semibold text-[var(--text)]",
										"hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] transition-colors",
										"disabled:opacity-50 disabled:cursor-not-allowed",
									)}
								>
									{dict.actions.exportCities}
								</button>
							</div>
							<CitiesTable
								dict={dict.cities}
								lang={lang}
								items={citiesItems}
								activeCountry={page.countryFilter}
								onClearFilter={() => page.setCountryFilter(null)}
								loading={page.citiesQuery.isLoading}
							/>
						</>
					)}
				</>
			)}
		</article>
	);
};
