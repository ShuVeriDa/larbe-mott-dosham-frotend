"use client";

import { cn } from "@/shared/lib";

interface RadioPillOption<T extends string> {
	value: T;
	label: string;
}

interface RadioPillGroupProps<T extends string> {
	name: string;
	value: T;
	options: readonly RadioPillOption<T>[];
	onChange: (value: T) => void;
	disabled?: boolean;
}

export const RadioPillGroup = <T extends string>({
	name,
	value,
	options,
	onChange,
	disabled,
}: RadioPillGroupProps<T>) => (
	<div
		role="radiogroup"
		aria-label={name}
		className="flex gap-2 flex-wrap"
	>
		{options.map(option => {
			const active = option.value === value;
			return (
				<button
					key={option.value}
					type="button"
					role="radio"
					aria-checked={active}
					disabled={disabled}
					onClick={() => onChange(option.value)}
					className={cn(
						"px-4 py-2 rounded-full text-xs font-medium border transition-colors",
						"disabled:cursor-not-allowed disabled:opacity-60",
						active
							? "border-primary bg-primary/10 text-primary"
							: "border-border bg-muted/30 text-muted-foreground hover:border-border/80 hover:text-foreground",
					)}
				>
					{option.label}
				</button>
			);
		})}
	</div>
);
