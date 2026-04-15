import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { Typography } from "@/shared/ui";

interface HeroHeadlineProps {
	headline: Dictionary["hero"]["headline"];
	locale?: string;
}

export function HeroHeadline({ headline, locale }: HeroHeadlineProps) {
	return (
		<div className="relative">
			<Typography
				tag="h1"
				className="text-[clamp(2.6rem,7vw,5rem)] font-extrabold tracking-[-0.05em] leading-none text-foreground mb-5"
			>
				<span className="hero-light font-light text-subtle">
					{headline.prefix}
				</span>
				<br />
				<span
					className={locale === "che" ? "text-primary hero-accent" : undefined}
				>
					{headline.connector}
				</span>
				<br className={cn(locale === "ru" ? "block" : "hidden")} />
				&nbsp;
				<span
					className={locale === "che" ? undefined : "text-primary hero-accent"}
				>
					{headline.accent}
				</span>
			</Typography>
		</div>
	);
}
