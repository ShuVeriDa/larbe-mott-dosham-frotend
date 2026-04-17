import { FC } from "react";

interface ISourcePillProps {
	name: string;
	annotation?: {
		kind: "dir" | "domain";
		label: string;
	};
}

export const SourcePill: FC<ISourcePillProps> = ({ name, annotation }) => (
	<span className="flex items-center gap-2 px-4 py-2 border border-edge rounded-full text-sm text-subtle transition-all hover:border-edge-hover hover:text-foreground hover:bg-surface">
		{name}
		{annotation?.kind === "dir" && (
			<span className="text-[0.6rem] text-faint font-mono">
				{annotation.label}
			</span>
		)}
		{annotation?.kind === "domain" && (
			<span className="text-xs text-warning font-medium">
				{annotation.label}
			</span>
		)}
	</span>
);
