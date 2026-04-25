"use client";

import type { Phrase } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface PhrasesEditorProps {
	value: Phrase[];
	onChange: (next: Phrase[]) => void;
	placeholders: Dictionary["admin"]["entryEdit"]["placeholders"];
	addLabel: string;
	removeLabel: string;
}

export const PhrasesEditor: FC<PhrasesEditorProps> = ({
	value,
	onChange,
	placeholders,
	addLabel,
	removeLabel,
}) => {
	const update = (index: number, patch: Partial<Phrase>) => {
		const copy = value.slice();
		copy[index] = { ...copy[index], ...patch };
		onChange(copy);
	};

	const remove = (index: number) => {
		const copy = value.slice();
		copy.splice(index, 1);
		onChange(copy);
	};

	const add = () => onChange([...value, { nah: "", ru: "" }]);

	return (
		<div className="flex flex-col gap-2">
			{value.map((row, i) => (
				<div
					key={i}
					className="grid grid-cols-[1fr_1fr_auto] gap-2 items-start"
				>
					<input
						type="text"
						value={row.nah}
						onChange={(e) => update(i, { nah: e.target.value })}
						placeholder={placeholders.chechen}
						className="px-2 py-1.5 text-xs bg-[var(--bg)] border border-[var(--border)] rounded-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-dim)]"
					/>
					<input
						type="text"
						value={row.ru}
						onChange={(e) => update(i, { ru: e.target.value })}
						placeholder={placeholders.russian}
						className="px-2 py-1.5 text-xs bg-[var(--bg)] border border-[var(--border)] rounded-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-dim)]"
					/>
					<button
						type="button"
						onClick={() => remove(i)}
						title={removeLabel}
						className="btn btn-sm btn-ghost text-[var(--danger)] hover:bg-[var(--danger-dim)]"
					>
						×
					</button>
				</div>
			))}
			<button
				type="button"
				onClick={add}
				className={cn(
					"w-full py-3 mt-1 text-sm font-medium rounded-md border-2 border-dashed",
					"border-[var(--border)] text-[var(--text-muted)] bg-transparent",
					"hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-dim)]",
					"transition-colors",
				)}
			>
				{addLabel}
			</button>
		</div>
	);
};
