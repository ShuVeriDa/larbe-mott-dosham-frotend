import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface SearchQueriesCalloutProps {
	dict: Dictionary["admin"]["analyticsSearchQueries"]["callout"];
}

export const SearchQueriesCallout: FC<SearchQueriesCalloutProps> = ({
	dict,
}) => (
	<aside
		className={cn(
			"flex flex-col sm:flex-row items-start gap-4 mb-5",
			"px-5 py-4 rounded-2xl",
			"bg-gradient-to-br from-[var(--accent-dim)] to-transparent",
			"border border-[var(--border-hover)]",
		)}
	>
		<div
			aria-hidden="true"
			className={cn(
				"shrink-0 w-10 h-10 rounded-md flex items-center justify-center",
				"bg-[var(--accent)] text-[var(--accent-on)] text-xl",
			)}
		>
			💡
		</div>
		<div>
			<h2 className="text-sm font-semibold text-[var(--text)] mb-1">
				{dict.title}
			</h2>
			<p className="text-xs text-[var(--text-secondary)] leading-relaxed">
				{dict.text}
			</p>
		</div>
	</aside>
);
