"use client";

import {
	useHealthCheck,
	usePipelineFullStatus,
} from "@/features/admin-pipeline";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC, ReactNode } from "react";
import { formatNumber } from "../lib";

interface Props {
	dict: Dictionary["admin"]["pipelineLoad"];
	lang: Locale;
}

const Prop: FC<{ label: string; value: ReactNode }> = ({ label, value }) => (
	<div className="px-4 py-3 bg-[var(--bg)] rounded-xl">
		<div className="text-xs text-[var(--text-muted)] mb-1">{label}</div>
		<div className="text-sm font-semibold text-[var(--text)] font-mono break-words">
			{value}
		</div>
	</div>
);

export const LoadDbInfo: FC<Props> = ({ dict, lang }) => {
	const statusQuery = usePipelineFullStatus();
	const healthQuery = useHealthCheck();

	const records = statusQuery.data?.database.entries ?? null;
	const dbStatus = healthQuery.data?.info?.database?.status;
	const isOnline = dbStatus === "up";
	const isLoadingHealth = healthQuery.isLoading;

	return (
		<>
			<header className="flex items-center justify-between gap-4 mb-4 flex-wrap">
				<h2 className="text-lg font-semibold text-[var(--text)]">
					{dict.db.title}
				</h2>
			</header>
			<section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden mb-8">
				<div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
					<span className="text-lg" aria-hidden>
						🐘
					</span>
					<span className="text-sm font-semibold text-[var(--text)] flex-1">
						{dict.db.serverName}
					</span>
					<span
						className={cn(
							"text-xs px-2 py-0.5 rounded-full font-medium",
							isLoadingHealth
								? "bg-[var(--surface)] text-[var(--text-muted)]"
								: isOnline
									? "bg-[var(--success-dim)] text-[var(--success)]"
									: "bg-[var(--danger-dim)] text-[var(--danger)]",
						)}
					>
						{isLoadingHealth
							? dict.db.unknown
							: isOnline
								? dict.db.online
								: dict.db.offline}
					</span>
				</div>
				<div className="p-5">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						<Prop label={dict.db.table} value={dict.db.tableValue} />
						<Prop
							label={dict.db.records}
							value={formatNumber(records, lang)}
						/>
						<Prop label={dict.db.index} value={dict.db.indexValue} />
						<Prop label={dict.db.search} value={dict.db.searchValue} />
						<Prop label={dict.db.cache} value={dict.db.cacheValue} />
						<Prop label={dict.db.orm} value={dict.db.ormValue} />
					</div>
				</div>
			</section>
		</>
	);
};
