"use client";

import {
	type ImproveHistoryItem,
	useImproveHistory,
} from "@/features/admin-pipeline";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface Props {
	dict: Dictionary["admin"]["pipelineImprove"]["history"];
	lang: Locale;
}

const LOCALE_MAP: Record<Locale, string> = {
	che: "ru-RU",
	ru: "ru-RU",
	en: "en-US",
};

const formatDate = (iso: string, lang: Locale): string => {
	try {
		const d = new Date(iso);
		return new Intl.DateTimeFormat(LOCALE_MAP[lang], {
			day: "2-digit",
			month: "short",
			hour: "2-digit",
			minute: "2-digit",
		}).format(d);
	} catch {
		return iso;
	}
};

export const ImproveHistoryGrid: FC<Props> = ({ dict, lang }) => {
	const query = useImproveHistory(20);
	const items: ImproveHistoryItem[] = query.data ?? [];

	return (
		<section className="mb-8">
			<header className="flex items-center justify-between gap-4 mb-4">
				<h2 className="text-lg font-semibold text-[var(--text)]">
					{dict.title}
				</h2>
			</header>

			<div className="grid grid-cols-1 gap-px bg-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden">
				<Row header dict={dict} />
				{items.length === 0 ? (
					<div className="bg-[var(--bg)] text-sm text-[var(--text-muted)] text-center py-8">
						{dict.empty}
					</div>
				) : (
					items.map((it) => (
						<div
							key={it.id}
							className="grid grid-cols-[140px_80px_80px_80px_1fr] lg:grid-cols-[160px_80px_90px_80px_1fr] items-center gap-3 px-4 py-3 bg-[var(--bg)] hover:bg-[var(--surface-hover)] text-sm"
						>
							<div className="text-xs text-[var(--text-muted)]">
								{formatDate(it.createdAt, lang)}
							</div>
							<div className="tabular-nums text-xs font-semibold text-[var(--success)]">
								{it.normalizedStyleLabels}
							</div>
							<div className="tabular-nums text-xs font-semibold text-[var(--info)]">
								{it.removedBrokenExamples}
							</div>
							<div className="tabular-nums text-xs font-semibold text-[var(--danger)] hidden lg:block">
								{it.removedEmptyMeanings}
							</div>
							<div>
								<span
									className={cn(
										"inline-flex items-center gap-1 text-xs font-medium",
										it.status === "ok"
											? "text-[var(--success)]"
											: "text-[var(--danger)]",
									)}
								>
									<span
										className={cn(
											"w-1.5 h-1.5 rounded-full",
											it.status === "ok"
												? "bg-[var(--success)]"
												: "bg-[var(--danger)]",
										)}
										aria-hidden
									/>
									{dict.status[it.status]}
								</span>
							</div>
						</div>
					))
				)}
			</div>
		</section>
	);
};

const Row: FC<{ header: true; dict: Props["dict"] }> = ({ dict }) => (
	<div className="grid grid-cols-[140px_80px_80px_80px_1fr] lg:grid-cols-[160px_80px_90px_80px_1fr] items-center gap-3 px-4 py-2 bg-[var(--surface)] text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
		<div>{dict.cols.date}</div>
		<div>{dict.cols.cleaned}</div>
		<div>{dict.cols.fixed}</div>
		<div className="hidden lg:block">{dict.cols.removed}</div>
		<div>{dict.cols.status}</div>
	</div>
);
