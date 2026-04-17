import { Typography } from "@/shared/ui";
import { FC, ReactNode } from "react";

interface IMorphPanelProps {
	word: string;
	subtitle: string;
	badge?: ReactNode;
	children: ReactNode;
}

export const MorphPanel: FC<IMorphPanelProps> = ({
	word,
	subtitle,
	badge,
	children,
}) => (
	<article className="bg-surface border border-edge rounded-lg p-6 transition-all duration-300 hover:border-edge-hover">
		<header className="flex items-start justify-between mb-5 pb-4 border-b border-edge">
			<div>
				<Typography
					tag="h3"
					className="text-2xl font-bold text-foreground tracking-[-0.02em]"
				>
					{word}
				</Typography>
				<p className="text-xs text-muted mt-1">{subtitle}</p>
			</div>
			{badge}
		</header>
		<div>{children}</div>
	</article>
);
