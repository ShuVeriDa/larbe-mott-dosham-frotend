"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { AdminEmptyState, PageHeader } from "@/shared/ui/admin";
import {
	AnalyticsTabs,
	AnalyticsToolbar,
	RealtimeBadge,
} from "@/widgets/admin-analytics-overview-page";
import type { FC } from "react";
import { toast } from "sonner";
import { useDevicesPageState } from "../model/use-devices-page-state";
import { DonutPanel } from "./donut-panel";

interface AdminAnalyticsDevicesPageProps {
	lang: Locale;
	analyticsDict: Dictionary["admin"]["analytics"];
	dict: Dictionary["admin"]["analyticsDevices"];
}

export const AdminAnalyticsDevicesPage: FC<AdminAnalyticsDevicesPageProps> = ({
	lang,
	analyticsDict,
	dict,
}) => {
	const state = useDevicesPageState();

	const handleRefresh = async () => {
		try {
			await state.refresh();
			toast.success(dict.toasts.refreshed);
		} catch {
			toast.error(dict.toasts.refreshError);
		}
	};

	return (
		<article className="max-w-[1280px] mx-auto">
			<PageHeader
				title={dict.header.title}
				subtitle={dict.header.subtitle}
				actions={
					<RealtimeBadge
						label={analyticsDict.realtime.label}
						tooltip={analyticsDict.realtime.tooltip}
					/>
				}
			/>

			<AnalyticsTabs
				lang={lang}
				dict={analyticsDict.tabs}
				activeKey="devices"
			/>

			<AnalyticsToolbar
				dict={analyticsDict.toolbar}
				rangeState={state.range}
				onRefresh={handleRefresh}
				refreshing={state.isFetching}
			/>

			{state.isAllEmpty ? (
				<AdminEmptyState
					title={dict.states.emptyAllTitle}
					description={dict.states.emptyAllDescription}
					icon="📊"
				/>
			) : (
				<div className="grid gap-5 grid-cols-1 lg:grid-cols-3">
					<DonutPanel
						kind="device"
						titleIcon="💻"
						title={dict.panels.devices}
						data={state.devicesQuery.data}
						loading={state.devicesQuery.isLoading}
						error={state.devicesQuery.isError}
						onRetry={() => {
							void state.devicesQuery.refetch();
						}}
						dict={dict}
						lang={lang}
					/>
					<DonutPanel
						kind="browser"
						titleIcon="🧭"
						title={dict.panels.browsers}
						data={state.browsersQuery.data}
						loading={state.browsersQuery.isLoading}
						error={state.browsersQuery.isError}
						onRetry={() => {
							void state.browsersQuery.refetch();
						}}
						dict={dict}
						lang={lang}
					/>
					<DonutPanel
						kind="os"
						titleIcon="🖥️"
						title={dict.panels.os}
						data={state.osQuery.data}
						loading={state.osQuery.isLoading}
						error={state.osQuery.isError}
						onRetry={() => {
							void state.osQuery.refetch();
						}}
						dict={dict}
						lang={lang}
					/>
				</div>
			)}
		</article>
	);
};
