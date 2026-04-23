"use client";

import { useUnifiedLog } from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";
import { useEffect, useState } from "react";
import type { UsePipelineActions } from "../model/use-pipeline-actions";
import { ActionCard, ActionCardResult } from "./action-card";

interface Props {
	dict: Dictionary["admin"]["pipeline"];
	actions: UsePipelineActions;
}

export const RollbackAction: FC<Props> = ({ dict, actions }) => {
	const logQuery = useUnifiedLog();
	const steps = logQuery.data?.steps ?? [];
	const [step, setStep] = useState<number | "">("");

	useEffect(() => {
		if (step === "" && steps.length > 0) {
			setStep(steps[steps.length - 1]?.step ?? "");
		}
	}, [step, steps]);

	const result = actions.results.rollback;
	const isEmpty = steps.length === 0;

	const onSubmit = () => {
		if (step === "") return;
		const target = steps.find((s) => s.step === step);
		if (!target) return;
		actions.confirmRollback(target.step, target.title);
	};

	return (
		<ActionCard
			icon="⏪"
			iconTone="rollback"
			title={dict.actions.rollback.title}
			description={dict.actions.rollback.description}
			footer={
				<>
					<select
						aria-label={dict.actions.rollback.title}
						value={step === "" ? "" : String(step)}
						onChange={(e) =>
							setStep(e.target.value === "" ? "" : Number(e.target.value))
						}
						disabled={isEmpty || actions.pending.rollback || actions.isRunning}
						className="h-8 px-3 pr-6 text-xs bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text)] appearance-none min-w-[160px] disabled:opacity-40"
					>
						{isEmpty ? (
							<option value="">{dict.actions.rollback.empty}</option>
						) : (
							[...steps].reverse().map((s) => (
								<option key={s.step} value={s.step}>
									{dict.actions.rollback.stepOption
										.replace("{step}", `${s.step}`)
										.replace("{label}", s.title)}
								</option>
							))
						)}
					</select>
					<button
						type="button"
						onClick={onSubmit}
						disabled={
							isEmpty ||
							step === "" ||
							actions.pending.rollback ||
							actions.isRunning
						}
						className="btn btn-sm btn-secondary disabled:opacity-40"
					>
						⏪ {dict.actions.rollback.run}
					</button>
				</>
			}
			result={
				result ? (
					result.ok ? (
						<ActionCardResult tone="ok">
							{dict.results.rollback
								.replace("{step}", `${result.data.rolledBackTo}`)
								.replace("{count}", `${result.data.currentEntries}`)}
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
