import { SourceBadge } from "@/entities/dictionary";
import type { FC } from "react";

interface RandomSourcesProps {
	sources: string[];
}

export const RandomSources: FC<RandomSourcesProps> = ({ sources }) => {
	if (!sources.length) return null;

	return (
		<div className="flex flex-wrap gap-2 mb-6">
			{sources.map(src => (
				<SourceBadge key={src} source={src} />
			))}
		</div>
	);
};
