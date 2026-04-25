import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import { countryName, isoToFlag } from "../lib/country";
import { PREVIEW_COUNTRIES } from "../lib/preview";
import { formatNumber } from "@/widgets/admin-analytics-overview-page";

interface GeoPreviewPanelProps {
	dict: Dictionary["admin"]["analytics"]["geography"]["preview"];
	mapDict: Dictionary["admin"]["analytics"]["geography"]["map"];
	lang: Locale;
}

export const GeoPreviewPanel: FC<GeoPreviewPanelProps> = ({
	dict,
	mapDict,
	lang,
}) => {
	const max = PREVIEW_COUNTRIES[0]?.count ?? 1;

	return (
		<section
			aria-label={dict.label}
			className={cn(
				"relative overflow-hidden rounded-2xl mb-6",
				"bg-[var(--surface)] border border-[var(--border)] p-5",
			)}
		>
			<span
				className={cn(
					"absolute top-3 left-3 z-[2] px-3 py-1 rounded-full",
					"bg-[var(--surface-active)] text-[var(--text-muted)]",
					"text-[0.65rem] font-bold tracking-wider uppercase backdrop-blur",
				)}
			>
				{dict.label}
			</span>
			<div
				aria-hidden="true"
				className={cn(
					"grid gap-5 mt-6",
					"grid-cols-1 lg:grid-cols-[1.6fr_1fr]",
					"opacity-55",
				)}
				style={{ filter: "saturate(0.7)" }}
			>
				<div
					className={cn(
						"relative overflow-hidden rounded-md",
						"bg-[var(--bg-raised)] border border-dashed border-[var(--border)]",
						"flex items-center justify-center",
					)}
					style={{ aspectRatio: "16 / 10" }}
				>
					<div
						aria-hidden="true"
						className="absolute inset-0"
						style={{
							background:
								"radial-gradient(circle at 60% 40%, var(--accent-dim), transparent 60%)",
						}}
					/>
					<span className="relative text-6xl opacity-25" aria-hidden="true">
						🗺️
					</span>
					<span className="sr-only">{mapDict.placeholder}</span>
				</div>
				<ul className="flex flex-col gap-2">
					{PREVIEW_COUNTRIES.map((row) => {
						const widthPct = Math.round((row.count / max) * 100);
						return (
							<li
								key={row.iso}
								className={cn(
									"relative overflow-hidden rounded-sm",
									"grid items-center gap-3 px-3 py-2",
									"grid-cols-[24px_1fr_auto]",
									"bg-[var(--bg-raised)] border border-[var(--border)]",
								)}
							>
								<span
									aria-hidden="true"
									className="absolute inset-y-0 left-0 bg-[var(--accent-dim)]"
									style={{ width: `${widthPct}%` }}
								/>
								<span className="relative z-[1] text-base">
									{isoToFlag(row.iso)}
								</span>
								<span className="relative z-[1] text-sm font-medium text-[var(--text)]">
									{countryName(row.iso, lang)}
								</span>
								<span className="relative z-[1] text-xs text-[var(--text-muted)] tabular-nums">
									{formatNumber(row.count, lang)}
								</span>
							</li>
						);
					})}
				</ul>
			</div>
			<div
				className={cn(
					"absolute inset-0 z-[3] flex flex-col items-center justify-end p-8 text-center",
					"backdrop-blur-[1px]",
				)}
				style={{
					background:
						"linear-gradient(180deg, transparent, var(--bg-overlay) 80%)",
				}}
			>
				<div className="text-base font-semibold text-[var(--text)] mb-2">
					{dict.overlayTitle}
				</div>
				<p className="text-xs text-[var(--text-muted)] max-w-md">
					{dict.overlayText}
				</p>
			</div>
		</section>
	);
};
