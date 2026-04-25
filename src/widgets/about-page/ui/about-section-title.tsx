import { Typography } from "@/shared/ui";
import { FC, ReactNode } from "react";

interface IAboutSectionTitleProps {
	children: ReactNode;
	id?: string;
}

export const AboutSectionTitle: FC<IAboutSectionTitleProps> = ({
	children,
	id,
}) => (
	<Typography
		tag="h2"
		id={id}
		className="text-xl font-bold tracking-[-0.02em] text-foreground mb-4 pb-3 border-b border-edge"
	>
		{children}
	</Typography>
);
