import { Typography } from "@/shared/ui";

interface HeroBadgeProps {
	badge: string;
}

export function HeroBadge({ badge }: HeroBadgeProps) {
	return (
		<div
			className="inline-flex items-center gap-2 mb-6
			bg-primary-dim px-4 py-1 rounded-full border border-edge-accent
			before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary before:animate-pulse"
		>
			<Typography
				tag="span"
				size="base"
				className="text-xs font-medium text-primary tracking-widest uppercase"
			>
				{badge}
			</Typography>
		</div>
	);
}
