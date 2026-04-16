"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { FC, Fragment } from "react";
import { useStatsBand } from "../model/useStatsBand";
import { StatCard } from "./stat-card";

interface IStatsBandViewProps {
	statsBand: Dictionary["statsBand"];
}

export const StatsBandView: FC<IStatsBandViewProps> = ({ statsBand }) => {
	const { items, isLoading, isError, isSuccess } = useStatsBand(statsBand);

	if (isLoading) return <div>{statsBand.loading}</div>;
	if (isError) return <div>{statsBand.error}</div>;
	if (!isSuccess) return <div>{statsBand.empty}</div>;

	return (
		<section className="w-full py-12 px-6 relative before:content-[''] before:absolute before:inset-0 before:border-y before:border-edge">
			<div className="max-w-[900px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
				{items.map((item, i) => (
					<Fragment key={item.label}>
						<StatCard label={item.label} value={item.value} />
						{i < items.length - 1 && (
							<div className="hidden md:block w-px bg-edge my-2" />
						)}
					</Fragment>
				))}
			</div>
		</section>
	);
};
