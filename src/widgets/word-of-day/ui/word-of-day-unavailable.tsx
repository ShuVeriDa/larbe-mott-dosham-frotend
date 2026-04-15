import { FC } from "react";
import { WordOfDayLabel } from "./word-of-day-label";

interface IWordOfDayUnavailableProps {
	label: string;
	unavailable: string;
}

export const WordOfDayUnavailable: FC<IWordOfDayUnavailableProps> = ({ label, unavailable }) => {
	return (
		<section className="px-6 pb-16 w-full">
			<div className="max-w-[600px] mx-auto">
				<div className="relative bg-raised border border-edge rounded-xl p-8 overflow-hidden">
					<WordOfDayLabel label={label} />
					<p className="text-sm text-muted">{unavailable}</p>
				</div>
			</div>
		</section>
	);
};
