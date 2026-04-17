import { Dictionary } from "@/i18n/dictionaries";
import { SearchBar } from "@/widgets/search-bar";
import { FC } from "react";
import { SearchHeroHeadline } from "./search-hero-headline";

interface ISearchHeroProps {
	search: Dictionary["search"];
	lang: string;
}

export const SearchHero: FC<ISearchHeroProps> = ({ search, lang }) => {
	return (
		<section
			aria-labelledby="search-hero-heading"
			className="relative text-center pt-20 pb-12"
		>
			<div
				aria-hidden
				className="pointer-events-none absolute left-1/2 -top-[30%] w-[500px] h-[500px] -translate-x-1/2 opacity-35 blur-[80px]"
				style={{
					background:
						"radial-gradient(circle, var(--accent-glow), transparent 70%)",
				}}
			/>
			<SearchHeroHeadline hero={search.hero} />
			<SearchBar search={search} lang={lang} />
		</section>
	);
};
