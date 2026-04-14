import { SearchBar } from "@/widgets";
import { Hero } from "@/widgets/hero/ui/hero";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<Hero>
				<SearchBar />
			</Hero>
		</div>
	);
}
