"use client";

import { usePipelineFullStatus } from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";
import type { UsePipelineActions } from "../model/use-pipeline-actions";
import { ActionCard, ActionCardResult } from "./action-card";

interface Props {
	dict: Dictionary["admin"]["pipeline"];
	actions: UsePipelineActions;
}

export const LoadAction: FC<Props> = ({ dict, actions }) => {
	const statusQuery = usePipelineFullStatus();
	const unifiedCount = statusQuery.data?.unified.entries ?? 0;

	const onSubmit = () => actions.confirmLoad(unifiedCount);
	const result = actions.results.load;

	return (
		<ActionCard
			icon="🗄"
			iconTone="load"
			title={dict.actions.load.title}
			description={dict.actions.load.description}
			footer={
				<button
					type="button"
					onClick={onSubmit}
					disabled={actions.pending.load || actions.isRunning}
					className="btn btn-sm btn-primary disabled:opacity-40"
				>
					🗄 {dict.actions.load.run}
				</button>
			}
			result={
				result ? (
					result.ok ? (
						<ActionCardResult tone="ok">
							{dict.results.load
								.replace("{loaded}", `${result.data.loaded ?? "—"}`)
								.replace("{skipped}", `${result.data.skipped ?? "—"}`)
								.replace(
									"{elapsed}",
									result.data.elapsedMs
										? (result.data.elapsedMs / 1000).toFixed(1)
										: "—",
								)}
						</ActionCardResult>
					) : (
						<ActionCardResult tone="err">
							{dict.results.error.replace("{message}", result.message)}
						</ActionCardResult>
					)
				) : null
			}
		/>
	);
};
