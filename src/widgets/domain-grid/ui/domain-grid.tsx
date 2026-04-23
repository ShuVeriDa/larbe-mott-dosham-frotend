import { FC } from "react";
import type { DictionaryStatsDomain } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import { Typography } from "@/shared/ui";
import { resolveDomain } from "../model/domain-labels";
import { DomainCard } from "./domain-card";

interface IDomainGridProps {
	domains: DictionaryStatsDomain[];
	labels: Dictionary["stats"]["domains"];
}

export const DomainGrid: FC<IDomainGridProps> = ({ domains, labels }) => {
	const visible = domains.filter(d => d.count > 0);

	return (
		<section
			aria-labelledby="stats-domains-heading"
			className="max-w-[1020px] w-full mx-auto px-6 pb-16"
		>
			<div className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
				{labels.eyebrow}
			</div>
			<Typography
				tag="h2"
				id="stats-domains-heading"
				className="text-xl font-bold tracking-[-0.02em] text-foreground mb-6"
			>
				{labels.title}
			</Typography>

			{visible.length === 0 ? (
				<div className="text-sm text-muted">{labels.empty}</div>
			) : (
				<div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))] max-[680px]:grid-cols-2 max-[400px]:grid-cols-1">
					{visible.map(({ domain, count, percentage }) => {
						const { label, icon } = resolveDomain(domain, labels.labels);
						return (
							<DomainCard
								key={domain}
								icon={icon}
								label={label}
								count={count}
								percentage={percentage}
							/>
						);
					})}
				</div>
			)}
		</section>
	);
};
