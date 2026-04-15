"use client";

import { Button, Input } from "@/shared/ui";
import { SearchIcon } from "lucide-react";
import { forwardRef } from "react";

interface SearchInputProps {
	onSubmit: () => void;
	onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	placeholder: string;
	buttonText: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
	({ onSubmit, onKeyDown, placeholder, buttonText }, ref) => (
		<div className="relative max-w-[560px] w-full mx-auto mb-5">
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
				onKeyDown={onKeyDown}
				className="pl-[3.2rem] sm:pr-32 pr-19 border-edge-hover bg-raised shadow-lg focus:shadow-focus-glow"
			/>
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
	),
);

SearchInput.displayName = "SearchInput";
