import { Typography } from "@/shared/ui";
import { FC } from "react";

interface IWordOfDayExampleProps {
	sentence: string;
	translation?: string;
}

export const WordOfDayExample: FC<IWordOfDayExampleProps> = ({
	sentence,
	translation,
}) => {
	return (
		<div className="bg-surface border-l-2 border-primary rounded-r-md px-5 py-4 mb-6">
			<div>
				<Typography
					tag="span"
					className="text-base font-medium text-foreground mb-1"
				>
					{sentence}
				</Typography>
			</div>
			<div>
				<Typography tag="span" className="text-sm text-muted italic">
					{translation}
				</Typography>
			</div>
		</div>
	);
};
