import type { FC } from "react";

export const DonutSkeleton: FC = () => (
	<div className="flex flex-col gap-5">
		<div className="flex items-center justify-center">
			<div
				aria-hidden="true"
				className="w-[180px] h-[180px] rounded-full motion-safe:animate-pulse"
				style={{
					background:
						"radial-gradient(closest-side, transparent 58%, var(--surface-hover) 60%, var(--surface-hover) 78%, transparent 80%)",
				}}
			/>
		</div>
		<ul className="flex flex-col gap-2" aria-hidden="true">
			{Array.from({ length: 4 }).map((_, i) => (
				<li
					key={i}
					className="h-9 rounded-md motion-safe:animate-pulse"
					style={{
						background:
							"linear-gradient(90deg, var(--skeleton-from), var(--skeleton-to), var(--skeleton-from))",
						backgroundSize: "200% 100%",
					}}
				/>
			))}
		</ul>
	</div>
);
