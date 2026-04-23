import type { AdminQualityBreakdown } from "@/features/admin-dashboard";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import Link from "next/link";
import type { FC } from "react";

interface QualityBreakdownProps {
	breakdown: AdminQualityBreakdown;
	dict: Dictionary["admin"]["dashboard"]["quality"];
	lang: string;
}

const nf = new Intl.NumberFormat("ru-RU");

const ROWS: {
	key: keyof AdminQualityBreakdown;
	problem: string;
	tone: "danger" | "warning" | "info" | "success";
	icon: string;
}[] = [
	{ key: "noMeanings", problem: "no-meanings", tone: "danger", icon: "⊗" },
	{ key: "noClass", problem: "no-class", tone: "warning", icon: "?" },
	{ key: "noPos", problem: "no-pos", tone: "info", icon: "·" },
	{ key: "noExamples", problem: "no-examples", tone: "success", icon: "—" },
];

export const QualityBreakdown: FC<QualityBreakdownProps> = ({
	breakdown,
	dict,
	lang,
}) => (
	<div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
		<h3 className="text-sm font-semibold text-[var(--text)] mb-5">
			{dict.breakdownTitle}
		</h3>
		<div className="space-y-0">
			{ROWS.map(({ key, problem, tone, icon }) => {
				const data = breakdown[key];
				return (
					<div
						key={key}
						className="flex items-center gap-4 py-3 border-b border-[var(--border)] last:border-b-0 flex-wrap"
					>
						<div
							className={cn(
								"w-8 h-8 rounded-md flex items-center justify-center text-sm shrink-0",
								tone === "danger" && "bg-[var(--danger-dim)] text-[var(--danger)]",
								tone === "warning" &&
									"bg-[var(--warning-dim)] text-[var(--warning)]",
								tone === "info" && "bg-[var(--info-dim)] text-[var(--info)]",
								tone === "success" &&
									"bg-[var(--success-dim)] text-[var(--success)]",
							)}
							aria-hidden
						>
							{icon}
						</div>
						<div className="flex-1 min-w-0">
							<div className="text-sm font-medium text-[var(--text)]">
								{dict.problems[key].name}
							</div>
							<div className="text-xs text-[var(--text-muted)]">
								{dict.problems[key].description}
							</div>
						</div>
						<div className="w-44 shrink-0">
							<div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
								<div
									className={cn(
										"h-full rounded-full transition-all duration-700",
										tone === "danger" && "bg-[var(--danger)]",
										tone === "warning" && "bg-[var(--warning)]",
										tone === "info" && "bg-[var(--info)]",
										tone === "success" && "bg-[var(--success)]",
									)}
									style={{ width: `${Math.max(0, Math.min(100, data.pct))}%` }}
								/>
							</div>
						</div>
						<div className="text-right min-w-[90px] shrink-0">
							<div className="text-sm font-semibold text-[var(--text)] tabular-nums">
								{nf.format(data.count)}
							</div>
							<div className="text-xs text-[var(--text-muted)] tabular-nums">
								{data.pct.toFixed(1)}%
							</div>
						</div>
						<Link
							href={`/${lang}/admin/quality/problems?type=${problem}`}
							className="text-xs text-[var(--accent)] hover:underline shrink-0"
						>
							{dict.jumpTo}
						</Link>
					</div>
				);
			})}
		</div>
	</div>
);
