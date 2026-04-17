"use client";

import { cn } from "@/lib/utils";
import { Button, Input } from "@/shared/ui";
import { SearchIcon, XIcon } from "lucide-react";
import { forwardRef, useEffect, useState, type ChangeEvent } from "react";

interface SearchInputProps {
	onSubmit: () => void;
	onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	onClear: () => void;
	clearLabel: string;
	placeholder: string;
	buttonText: string;
	isSearchPage: boolean;
	isLandingPage: boolean;
	defaultValue?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
	(
		{
			onSubmit,
			onKeyDown,
			onClear,
			clearLabel,
			placeholder,
			buttonText,
			isSearchPage,
			isLandingPage,
			defaultValue,
		},
		ref,
	) => {
		const [hasValue, setHasValue] = useState(Boolean(defaultValue));

		// Re-sync visibility when URL-driven default changes (e.g. browser back/forward).
		useEffect(() => {
			setHasValue(Boolean(defaultValue));
		}, [defaultValue]);

		const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
			setHasValue(e.target.value.length > 0);
		};

		return (
			<div
				className={cn(
					"relative w-full mx-auto mb-5",
					isLandingPage
						? "max-w-[560px]"
						: isSearchPage
							? "max-w-[640px]"
							: "max-w-[560px]",
				)}
			>
				<label htmlFor="search-input" className="sr-only">
					{placeholder}
				</label>
				<SearchIcon
					size={20}
					className="absolute left-5 top-1/2 -translate-y-1/2 text-muted pointer-events-none z-10"
				/>
				<Input
					ref={ref}
					id="search-input"
					size="lg"
					type="text"
					placeholder={placeholder}
					autoComplete="off"
					autoFocus
					defaultValue={defaultValue}
					onChange={handleChange}
					onKeyDown={onKeyDown}
					className="pl-[3.2rem] sm:pr-40 pr-26 border-edge-hover bg-raised shadow-lg focus:shadow-focus-glow"
				/>
				{hasValue && (
					<button
						type="button"
						aria-label={clearLabel}
						onClick={onClear}
						className="absolute sm:right-32 right-22 top-1/2 -translate-y-1/2 bg-transparent border-none text-faint hover:text-foreground text-lg leading-none p-1 cursor-pointer transition-colors"
					>
						<XIcon size={16} />
					</button>
				)}
				<Button
					onClick={onSubmit}
					size="md"
					variant="primary"
					className="absolute right-2 top-2 h-10 px-5 hover:translate-0"
				>
					<span className="hidden sm:inline">{buttonText}</span>
					<kbd className="font-mono text-[1rem] opacity-60">↵</kbd>
				</Button>
			</div>
		);
	},
);

SearchInput.displayName = "SearchInput";
