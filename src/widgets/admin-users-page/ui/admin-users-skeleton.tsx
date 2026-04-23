import type { FC } from "react";

const ROWS = [0, 1, 2, 3, 4, 5, 6, 7];

export const AdminUsersSkeleton: FC = () => (
	<div role="status" aria-busy className="flex flex-col gap-3">
		<div className="rounded-lg border border-border overflow-hidden">
			<div className="bg-muted/50 h-10 border-b border-border" />
			<ul className="divide-y divide-border list-none">
				{ROWS.map((i) => (
					<li
						key={i}
						className="px-4 py-3 flex items-center gap-3 animate-pulse"
					>
						<div className="size-9 rounded-full bg-surface-active" />
						<div className="flex-1 flex flex-col gap-2">
							<div className="h-3.5 w-40 rounded-sm bg-surface-active" />
							<div className="h-3 w-56 rounded-sm bg-surface-active" />
						</div>
						<div className="h-5 w-20 rounded-full bg-surface-active hidden md:block" />
						<div className="h-5 w-24 rounded-full bg-surface-active hidden md:block" />
						<div className="h-5 w-16 rounded-sm bg-surface-active hidden lg:block" />
					</li>
				))}
			</ul>
		</div>
	</div>
);
