"use client";

import { cn } from "@/shared/lib";
import {
	type FC,
	type KeyboardEvent,
	useCallback,
	useRef,
	useState,
} from "react";

interface TagInputProps {
	value: string[];
	onChange: (next: string[]) => void;
	placeholder?: string;
	hint?: string;
	className?: string;
	removeAriaLabel?: string;
}

export const TagInput: FC<TagInputProps> = ({
	value,
	onChange,
	placeholder,
	hint,
	className,
	removeAriaLabel = "×",
}) => {
	const [draft, setDraft] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const addTag = useCallback(
		(raw: string) => {
			const trimmed = raw.trim();
			if (!trimmed) return;
			if (value.includes(trimmed)) return;
			onChange([...value, trimmed]);
			setDraft("");
		},
		[onChange, value],
	);

	const removeAt = useCallback(
		(index: number) => {
			const next = value.slice();
			next.splice(index, 1);
			onChange(next);
		},
		[onChange, value],
	);

	const onKey = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter" || e.key === ",") {
				e.preventDefault();
				addTag(draft);
				return;
			}
			if (e.key === "Backspace" && !draft && value.length > 0) {
				removeAt(value.length - 1);
			}
		},
		[addTag, draft, removeAt, value.length],
	);

	return (
		<div className={className}>
			<div
				className={cn(
					"flex flex-wrap gap-2 px-3 py-2 min-h-[38px]",
					"bg-[var(--surface)] border border-[var(--border)] rounded-md",
					"focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent-dim)]",
					"cursor-text transition-colors",
				)}
				onClick={() => inputRef.current?.focus()}
			>
				{value.map((tag, i) => (
					<span
						key={`${tag}-${i}`}
						className={cn(
							"inline-flex items-center gap-1 px-2 py-0.5 rounded-sm",
							"text-xs font-medium bg-[var(--accent-dim)] text-[var(--accent)]",
							"border border-[var(--border-accent)]",
						)}
					>
						{tag}
						<button
							type="button"
							aria-label={removeAriaLabel}
							onClick={(e) => {
								e.stopPropagation();
								removeAt(i);
							}}
							className="opacity-60 hover:opacity-100 transition-opacity leading-none"
						>
							×
						</button>
					</span>
				))}
				<input
					ref={inputRef}
					type="text"
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					onKeyDown={onKey}
					onBlur={() => draft && addTag(draft)}
					placeholder={placeholder}
					className={cn(
						"flex-1 min-w-[80px] bg-transparent border-none outline-none",
						"text-sm text-[var(--text)] placeholder:text-[var(--text-faint)]",
					)}
				/>
			</div>
			{hint ? (
				<div className="text-xs text-[var(--text-faint)] mt-1">{hint}</div>
			) : null}
		</div>
	);
};
