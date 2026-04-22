"use client";

import { useSourcesValues } from "@/entities/dictionary";
import { type FC, useMemo } from "react";

interface SourcesPanelProps {
	sources: string[];
	emptyLabel: string;
}

export const SourcesPanel: FC<SourcesPanelProps> = ({
	sources,
	emptyLabel,
}) => {
	const { sources: allSources } = useSourcesValues();

	const mapped = useMemo(() => {
		const bySlug = new Map((allSources ?? []).map(s => [s.slug, s]));
		return sources.map(slug => ({
			slug,
			name: bySlug.get(slug)?.name,
		}));
	}, [sources, allSources]);

	if (sources.length === 0) {
		return <p className="text-sm text-muted py-4">{emptyLabel}</p>;
	}

	return (
		<div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(200px,1fr))] max-md:grid-cols-1">
			{mapped.map(source => (
				<article
					key={source.slug}
					className="bg-surface border border-edge rounded-md px-4 py-3 hover:border-edge-hover hover:bg-surface-hover transition"
				>
					<div className="font-mono text-xs text-primary mb-1">
						{source.slug}
					</div>
					{source.name && (
						<div className="text-sm text-subtle font-light">{source.name}</div>
					)}
				</article>
			))}
		</div>
	);
};
