import { FC } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { Typography } from "@/shared/ui";

interface IStatsErrorProps {
	error: Dictionary["stats"]["error"];
}

export const StatsError: FC<IStatsErrorProps> = ({ error }) => (
	<section className="max-w-[1020px] w-full mx-auto px-6 py-16 text-center">
		<Typography
			tag="h2"
			className="text-xl font-bold text-foreground mb-2"
		>
			{error.title}
		</Typography>
		<Typography tag="p" className="text-sm text-muted font-light">
			{error.text}
		</Typography>
	</section>
);
