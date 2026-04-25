import { Badge, Typography } from "@/shared/ui";
import { FC } from "react";
import type {
	AboutSourceDomain,
	AboutSourceSlug,
} from "../model/sources";

interface IAboutSourceCardProps {
	slug: AboutSourceSlug;
	name: string;
	meta: string;
	domainLabel: string | null;
	domain: AboutSourceDomain;
}

const NON_BADGED_DOMAINS: ReadonlyArray<AboutSourceDomain> = ["general", "misc"];

export const AboutSourceCard: FC<IAboutSourceCardProps> = ({
	slug,
	name,
	meta,
	domainLabel,
	domain,
}) => {
	const showDomainBadge =
		domainLabel !== null && !NON_BADGED_DOMAINS.includes(domain);

	return (
		<article className="flex flex-col gap-1 p-4 bg-surface border border-edge rounded-lg">
			<Typography
				tag="h3"
				className="text-sm font-semibold text-foreground"
			>
				{name}
			</Typography>
			<Typography tag="p" className="text-xs text-muted">
				{meta}
			</Typography>
			<div className="flex gap-2 mt-2 flex-wrap">
				<Badge variant="outline">{slug}</Badge>
				{showDomainBadge && (
					<Badge variant="warning">{domainLabel}</Badge>
				)}
			</div>
		</article>
	);
};
