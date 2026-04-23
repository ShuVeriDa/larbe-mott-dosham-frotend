"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";
import type { UsePipelineActions } from "../model/use-pipeline-actions";
import { ActionCard, ActionCardResult } from "./action-card";

interface Props {
	dict: Dictionary["admin"]["pipeline"];
	actions: UsePipelineActions;
}

export const ImproveAction: FC<Props> = ({ dict, actions }) => {
	const result = actions.results.improve;

	return (
		<ActionCard
			icon="🧹"
			iconTone="improve"
			title={dict.actions.improve.title}
			description={dict.actions.improve.description}
			footer={
				<button
					type="button"
					onClick={actions.confirmImprove}
					disabled={actions.pending.improve || actions.isRunning}
					className="btn btn-sm btn-warning disabled:opacity-40"
				>
					🧹 {dict.actions.improve.run}
				</button>
			}
			result={
				result ? (
					result.ok ? (
						<ActionCardResult tone="ok">
							{dict.results.improve
								.replace("{cleaned}", `${result.data.cleaned ?? "—"}`)
								.replace(
									"{fixed}",
									`${result.data.fixedExamples ?? "—"}`,
								)
								.replace(
									"{empty}",
									`${result.data.removedEmpty ?? "—"}`,
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
