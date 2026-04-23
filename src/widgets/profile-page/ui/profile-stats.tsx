"use client";

import { useUserStats } from "@/entities/user";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";

interface ProfileStatsProps {
	dict: Dictionary["profile"]["stats"];
}

const StatCard: FC<{ value: number | string; label: string }> = ({
	value,
	label,
}) => (
	<div className="bg-surface border border-edge rounded-lg p-4 text-center max-sm:p-3">
		<div className="text-xl font-bold max-sm:text-lg">{value}</div>
		<div className="text-xs text-muted mt-1">{label}</div>
	</div>
);

export const ProfileStats: FC<ProfileStatsProps> = ({ dict }) => {
	const { data, isLoading } = useUserStats();

	const placeholder = isLoading ? "—" : 0;
	const favorites = data?.favoritesCount ?? placeholder;
	const searches = data?.searchCount ?? placeholder;
	const suggestions = data?.suggestionsCount ?? placeholder;

	return (
		<section
			aria-label="stats"
			className="grid grid-cols-3 gap-3 mb-8 max-sm:gap-2"
		>
			<StatCard value={favorites} label={dict.favorites} />
			<StatCard value={searches} label={dict.searches} />
			<StatCard value={suggestions} label={dict.suggestions} />
		</section>
	);
};
