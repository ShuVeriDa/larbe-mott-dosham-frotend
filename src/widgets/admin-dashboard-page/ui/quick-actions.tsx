import type { Dictionary } from "@/i18n/dictionaries";
import Link from "next/link";
import type { FC } from "react";

interface QuickActionsProps {
	dict: Dictionary["admin"]["dashboard"]["quickActions"];
	lang: string;
}

export const QuickActions: FC<QuickActionsProps> = ({ dict, lang }) => {
	const items: {
		href: string;
		icon: string;
		title: string;
		description: string;
	}[] = [
		{
			href: `/${lang}/admin/quality/problems?type=no-meanings`,
			icon: "⚡",
			title: dict.fix.title,
			description: dict.fix.description,
		},
		{
			href: `/${lang}/admin/pipeline/improve`,
			icon: "🧹",
			title: dict.improve.title,
			description: dict.improve.description,
		},
		{
			href: `/${lang}/admin/suggestions`,
			icon: "💬",
			title: dict.review.title,
			description: dict.review.description,
		},
	];

	return (
		<section className="mb-8">
			<h2 className="text-lg font-semibold text-[var(--text)] mb-4">
				{dict.title}
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{items.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 transition-all hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] text-center"
					>
						<div className="text-2xl mb-3">{item.icon}</div>
						<div className="text-sm font-semibold text-[var(--text)] mb-1">
							{item.title}
						</div>
						<div className="text-xs text-[var(--text-muted)]">
							{item.description}
						</div>
					</Link>
				))}
			</div>
		</section>
	);
};
