import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { PageHeader } from "@/shared/ui/admin";
import {
	type AdminNavKey,
	buildAdminNavGroups,
} from "@/widgets/admin-shell/lib/nav-items";
import Link from "next/link";
import type { FC } from "react";

interface AdminDashboardPageProps {
	lang: Locale;
	dict: Dictionary["admin"]["dashboard"];
	shellDict: Dictionary["admin"]["shell"];
}

const HIDDEN_KEYS: ReadonlySet<AdminNavKey> = new Set(["dashboard"]);

type DescriptionKey = keyof Dictionary["admin"]["dashboard"]["descriptions"];

const isDescribedKey = (
	key: AdminNavKey,
	descriptions: Dictionary["admin"]["dashboard"]["descriptions"],
): key is DescriptionKey => key in descriptions;

export const AdminDashboardPage: FC<AdminDashboardPageProps> = ({
	lang,
	dict,
	shellDict,
}) => {
	const groups = buildAdminNavGroups(lang)
		.map((group) => ({
			...group,
			items: group.items.filter(
				(item) => !item.isSub && !HIDDEN_KEYS.has(item.key),
			),
		}))
		.filter((group) => group.items.length > 0);

	return (
		<article className="max-w-[1280px] mx-auto">
			<PageHeader title={dict.header.title} subtitle={dict.header.subtitle} />
			<div className="space-y-10">
				{groups.map((group) => (
					<section key={group.key}>
						<h2 className="text-lg font-semibold text-[var(--text)] mb-4">
							{shellDict.sections[group.key]}
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{group.items.map((item) => (
								<Link
									key={item.key}
									href={item.href}
									className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 transition-all hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] flex items-start gap-4"
								>
									<div className="text-2xl leading-none">{item.icon}</div>
									<div className="flex-1 min-w-0">
										<div className="text-sm font-semibold text-[var(--text)] mb-1">
											{shellDict.items[item.labelKey]}
										</div>
										<div className="text-xs text-[var(--text-muted)]">
											{isDescribedKey(item.key, dict.descriptions)
												? dict.descriptions[item.key]
												: null}
										</div>
									</div>
								</Link>
							))}
						</div>
					</section>
				))}
			</div>
		</article>
	);
};
