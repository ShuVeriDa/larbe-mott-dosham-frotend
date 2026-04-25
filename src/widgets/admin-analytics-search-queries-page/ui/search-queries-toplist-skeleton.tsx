import { cn } from "@/shared/lib";
import type { FC } from "react";

interface SearchQueriesToplistSkeletonProps {
	rows?: number;
}

export const SearchQueriesToplistSkeleton: FC<SearchQueriesToplistSkeletonProps> = ({
	rows = 12,
}) => (
	<div className="p-2 space-y-2" aria-hidden="true">
		{Array.from({ length: rows }).map((_, i) => (
			<div
				key={i}
				className={cn(
					"h-11 rounded-md animate-pulse",
					"bg-gradient-to-r from-[var(--surface)] via-[var(--surface-hover)] to-[var(--surface)]",
					"bg-[length:200%_100%]",
				)}
			/>
		))}
	</div>
);
