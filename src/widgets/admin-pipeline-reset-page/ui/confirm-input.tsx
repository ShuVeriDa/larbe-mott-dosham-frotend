"use client";

import { cn } from "@/shared/lib";
import type { FC } from "react";

interface ConfirmInputProps {
	value: string;
	onChange: (next: string) => void;
	expectedPhrase: string;
	placeholder: string;
	label: string;
	cta: string;
	endpoint: string;
	isPending: boolean;
	disabled: boolean;
	onSubmit: () => void;
}

export const ConfirmInput: FC<ConfirmInputProps> = ({
	value,
	onChange,
	expectedPhrase,
	placeholder,
	label,
	cta,
	endpoint,
	isPending,
	disabled,
	onSubmit,
}) => {
	const valid = value === expectedPhrase;

	return (
		<div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5 text-center">
			<p
				className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed"
				// dict label uses {phrase} placeholder
			>
				{label.split("{phrase}").map((chunk, i, arr) => (
					<span key={i}>
						{chunk}
						{i < arr.length - 1 ? (
							<b className="text-[var(--danger)] font-mono">
								{expectedPhrase}
							</b>
						) : null}
					</span>
				))}
			</p>

			<div className="flex items-center gap-3 justify-center flex-wrap mb-5">
				<input
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					autoComplete="off"
					spellCheck={false}
					disabled={isPending}
					className={cn(
						"h-11 px-4 text-sm border-2 rounded-md font-mono w-[220px] max-w-full text-center transition-colors",
						"bg-[var(--surface)] text-[var(--text)]",
						"focus:outline-none",
						valid
							? "border-[var(--danger)] bg-[var(--danger-dim)]"
							: "border-[var(--border)] focus:border-[var(--danger)]",
					)}
				/>
			</div>

			<button
				type="button"
				onClick={onSubmit}
				disabled={disabled || isPending}
				className={cn(
					"btn btn-lg btn-danger inline-flex items-center gap-2",
					"disabled:opacity-40 disabled:pointer-events-none",
				)}
			>
				{cta}
			</button>

			<div className="text-xs text-[var(--text-faint)] font-mono mt-3">
				{endpoint}
			</div>
		</div>
	);
};
