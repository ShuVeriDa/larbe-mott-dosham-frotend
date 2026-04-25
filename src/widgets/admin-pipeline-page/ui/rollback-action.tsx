"use client";

import { useUnifiedLog } from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui";
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
					<Select
						value={step === "" ? undefined : String(step)}
						onValueChange={(value) => setStep(Number(value))}
						disabled={isEmpty || actions.pending.rollback || actions.isRunning}
					>
						<SelectTrigger
							size="sm"
							aria-label={dict.actions.rollback.title}
							className="min-w-[160px] text-xs"
						>
							<SelectValue
								placeholder={
									isEmpty ? dict.actions.rollback.empty : undefined
								}
							/>
						</SelectTrigger>
						<SelectContent>
							{[...steps].reverse().map((s) => (
								<SelectItem key={s.step} value={String(s.step)}>
									{dict.actions.rollback.stepOption
										.replace("{step}", `${s.step}`)
										.replace("{label}", s.title)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
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
