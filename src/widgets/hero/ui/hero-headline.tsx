import { Typography } from "@/shared/ui";

export function HeroHeadline() {
	return (
		<div className="relative">
			<Typography
				tag="h1"
				className="text-[clamp(2.6rem,7vw,5rem)] font-extrabold tracking-[-0.05em] leading-none text-foreground mb-5"
			>
				<span className="hero-light font-light text-subtle">Один словарь</span>
				<br />
				<span>вместо </span>
				<span className="text-primary hero-accent">четырнадцати</span>
			</Typography>
		</div>
	);
}
