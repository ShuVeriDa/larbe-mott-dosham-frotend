import type { FC } from "react";

export const ProfileSkeleton: FC = () => (
	<div
		role="status"
		aria-live="polite"
		className="max-w-[720px] mx-auto px-6 py-8 pb-16 max-sm:px-4 max-sm:py-5 animate-pulse"
	>
		<div className="flex items-center gap-6 mb-8 max-sm:flex-col max-sm:gap-4">
			<div className="w-20 h-20 rounded-full bg-surface shrink-0" />
			<div className="flex flex-col gap-3 flex-1 w-full">
				<div className="h-6 w-48 rounded-sm bg-surface" />
				<div className="h-4 w-32 rounded-sm bg-surface" />
			</div>
		</div>
		<div className="grid grid-cols-3 gap-3 mb-8">
			{[0, 1, 2].map(i => (
				<div
					key={i}
					className="h-20 rounded-lg border border-edge bg-surface"
				/>
			))}
		</div>
		<div className="h-10 rounded-sm bg-surface mb-4" />
		<div className="h-40 rounded-sm bg-surface" />
	</div>
);
