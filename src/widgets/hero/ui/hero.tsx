import type { Dictionary } from "@/i18n/dictionaries";
import { FC, ReactNode } from "react";
import { HeroBadge } from "./hero-badge";
import { HeroBgLetters } from "./hero-bg-letters";
import { HeroDescription } from "./hero-description";
import { HeroHeadline } from "./hero-headline";

interface IHeroProps {
	children: ReactNode;
	dict: Dictionary;
	locale?: string;
}

export const Hero: FC<IHeroProps> = ({ children, dict, locale }) => {
	return (
		<section className="hero relative w-full min-h-[calc(100vh-52px)] flex flex-col items-center justify-center px-6 pt-16 pb-12 text-center overflow-hidden">
			<HeroBgLetters />
			<div className="relative z-10 max-w-[720px]">
				<HeroBadge badge={dict.hero.badge} />
				<HeroHeadline headline={dict.hero.headline} locale={locale} />
				<HeroDescription description={dict.hero.description} />
			</div>
			{children}
			<div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-faint text-xs" />
		</section>
	);
};
