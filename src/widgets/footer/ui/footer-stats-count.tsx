"use client";

import { useDictionaryStats } from "@/entities/dictionary";
import { FC } from "react";

interface FooterStatsCountProps {
	fallback: number;
	singular: string;
	plural: string;
}

export const FooterStatsCount: FC<FooterStatsCountProps> = ({
	fallback,
	singular,
	plural,
}) => {
	const { stats } = useDictionaryStats();
	const total = stats?.total ?? fallback;

	return (
		<>
			{total} {total === 1 ? singular : plural}
		</>
	);
};
