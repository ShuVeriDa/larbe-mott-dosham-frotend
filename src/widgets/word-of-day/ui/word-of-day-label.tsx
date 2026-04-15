import { FC } from "react";

interface IWordOfDayLabelProps {
	label: string;
}

export const WordOfDayLabel: FC<IWordOfDayLabelProps> = ({ label }) => {
	return (
		<div className="text-xs font-medium text-primary uppercase tracking-[0.08em] mb-5 flex items-center gap-2 before:content-[''] before:w-4 before:h-px before:bg-primary">
			{label}
		</div>
	);
};
