import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import type { SelectedEntry } from "../model";

interface Props {
	selected: SelectedEntry[];
	overLimit: boolean;
	onRemove: (id: number) => void;
	onClearAll: () => void;
	dict: Dictionary["admin"]["entriesBulk"]["select"];
}

export const BulkEntryChips: FC<Props> = ({
	selected,
	overLimit,
	onRemove,
	onClearAll,
	dict,
}) => {
	const count = selected.length;

	return (
		<div className="mb-6">
			<div
				className={cn(
					"flex items-center gap-3 px-4 py-3 rounded-md border text-sm font-semibold mb-3",
					overLimit
						? "bg-[var(--danger-dim)] border-[var(--danger)] text-[var(--danger)]"
						: "bg-[var(--accent-dim)] border-[var(--border-accent)] text-[var(--accent)]",
				)}
			>
				<span className="font-mono text-lg tabular-nums">{count}</span>
				<span>{dict.counter.selected}</span>
				{count > 0 ? (
					<button
						type="button"
						onClick={onClearAll}
						className="text-xs font-normal underline underline-offset-2 opacity-70 hover:opacity-100 ml-2"
					>
						{dict.chips.removeAll}
					</button>
				) : null}
				<span className="ml-auto text-xs font-normal opacity-70">
					{overLimit ? dict.counter.overLimit : dict.counter.max}
				</span>
			</div>

			{count === 0 ? (
				<p className="text-xs text-[var(--text-muted)]">{dict.chips.empty}</p>
			) : (
				<ul className="flex flex-wrap gap-2" aria-label="Selected entries">
					{selected.map((s) => (
						<li
							key={s.id}
							className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--surface-active)] border border-[var(--border)] rounded-full text-xs text-[var(--text)] hover:border-[var(--border-hover)] transition-colors"
						>
							<span className="font-semibold">{s.word}</span>
							<span className="font-mono text-[0.6rem] text-[var(--text-faint)]">
								#{s.id}
							</span>
							<button
								type="button"
								aria-label={`${dict.chips.removeAll} #${s.id}`}
								onClick={() => onRemove(s.id)}
								className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer text-xs leading-none hover:text-[var(--danger)] transition-colors"
							>
								×
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
