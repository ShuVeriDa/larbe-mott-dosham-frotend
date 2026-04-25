import { Typography } from "@/shared/ui";
import { FC } from "react";

interface GrammarSegment {
	accent?: string;
	text?: string;
}

interface IAboutGrammarCardProps {
	title: string;
	segments: ReadonlyArray<GrammarSegment>;
}

export const AboutGrammarCard: FC<IAboutGrammarCardProps> = ({
	title,
	segments,
}) => (
	<article className="p-5 bg-surface border border-edge rounded-lg">
		<Typography
			tag="h3"
			className="text-sm font-semibold text-foreground mb-2"
		>
			{title}
		</Typography>
		<Typography tag="p" className="text-xs text-muted leading-[1.7]">
			{segments.map((segment, index) => {
				if (segment.accent) {
					return (
						<Typography
							key={index}
							tag="strong"
							className="text-primary font-semibold"
						>
							{segment.accent}
						</Typography>
					);
				}
				return <span key={index}>{segment.text}</span>;
			})}
		</Typography>
	</article>
);
