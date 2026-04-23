"use client";

import type {
	QualityProblemType,
	QualityStats,
} from "@/features/admin-quality";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";
import { QualityBreakdown } from "./quality-breakdown";
import { QualityRing } from "./quality-ring";

interface QualityOverviewProps {
	stats?: QualityStats;
	loading?: boolean;
	onJump: (type: QualityProblemType) => void;
	dict: Dictionary["admin"]["quality"];
}

export const QualityOverview: FC<QualityOverviewProps> = ({
	stats,
	loading,
	onJump,
	dict,
}) => (
	<div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 mb-8 items-start">
		<QualityRing
			total={stats?.total ?? 0}
			cleanEntries={stats?.cleanEntries ?? 0}
			loading={loading}
			dict={dict.ring}
		/>
		<QualityBreakdown stats={stats} onJump={onJump} dict={dict.breakdown} />
	</div>
);
