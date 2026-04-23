"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";
import type { UsePipelineActions } from "../model/use-pipeline-actions";
import { ActionCard, ActionCardResult } from "./action-card";

interface Props {
	dict: Dictionary["admin"]["pipeline"];
	actions: UsePipelineActions;
}

export const ResetAction: FC<Props> = ({ dict, actions }) => {
	const result = actions.results.reset;

	return (
		<ActionCard
			icon="💥"
			iconTone="reset"
			title={dict.actions.reset.title}
			description={dict.actions.reset.description}
			footer={
				<button
					type="button"
					onClick={actions.confirmReset}
					disabled={actions.pending.reset || actions.isRunning}
					className="btn btn-sm btn-danger disabled:opacity-40"
				>
					💥 {dict.actions.reset.run}
				</button>
			}
			result={
				result ? (
					result.ok ? (
						<ActionCardResult tone="ok">
							{dict.results.reset
								.replace(
									"{snapshots}",
									`${result.data.deletedSnapshots}`,
								)
								.replace("{freed}", result.data.freedMb.toFixed(1))}
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
