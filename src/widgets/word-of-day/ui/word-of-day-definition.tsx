import { FC } from "react";

interface IWordOfDayDefinitionProps {
	definition: string;
}

export const WordOfDayDefinition: FC<IWordOfDayDefinitionProps> = ({
	definition,
}) => {
	return (
		<div className="text-md text-subtle font-light mb-5 leading-normal">
			{definition}
		</div>
	);
};
