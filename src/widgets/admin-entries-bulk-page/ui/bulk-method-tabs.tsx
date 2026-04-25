import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { SectionCard } from "@/shared/ui/admin";
import type { FC } from "react";
import type { SelectionMethod } from "../model";

interface Props {
	method: SelectionMethod;
	onChange: (m: SelectionMethod) => void;
	dict: Dictionary["admin"]["entriesBulk"];
}

const CARDS: { key: SelectionMethod; icon: string }[] = [
	{ key: "ids", icon: "🔢" },
	{ key: "search", icon: "🔍" },
	{ key: "filter", icon: "🏷" },
];

export const BulkMethodTabs: FC<Props> = ({ method, onChange, dict }) => (
	<SectionCard title={dict.method.title}>
		<p className="text-xs text-[var(--text-muted)] -mt-2 mb-4">
			{dict.method.subtitle}
		</p>
		<div className="grid gap-3 grid-cols-1 md:grid-cols-3" role="tablist">
			{CARDS.map((c) => {
				const active = method === c.key;
				const text = dict.method[c.key];
				return (
					<button
						key={c.key}
						type="button"
						role="tab"
						aria-selected={active}
						onClick={() => onChange(c.key)}
						className={cn(
							"text-center p-4 rounded-xl border-2 transition-colors cursor-pointer",
							active
								? "border-[var(--accent)] bg-[var(--accent-dim)]"
								: "border-[var(--border)] bg-[var(--bg)] hover:border-[var(--border-hover)] hover:bg-[var(--surface)]",
						)}
					>
						<div className="text-2xl mb-2" aria-hidden>
							{c.icon}
						</div>
						<div className="text-sm font-semibold text-[var(--text)] mb-1">
							{text.title}
						</div>
						<div className="text-xs text-[var(--text-muted)] leading-snug">
							{text.description}
						</div>
					</button>
				);
			})}
		</div>
	</SectionCard>
);
