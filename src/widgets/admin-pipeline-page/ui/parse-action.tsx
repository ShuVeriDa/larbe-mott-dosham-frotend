"use client";

import { usePipelineDictionaries } from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";
import { useMemo, useState } from "react";
import type { UsePipelineActions } from "../model/use-pipeline-actions";
import { ActionCard, ActionCardResult } from "./action-card";

interface Props {
	dict: Dictionary["admin"]["pipeline"];
	actions: UsePipelineActions;
}

const ALL = "__all__";

export const ParseAction: FC<Props> = ({ dict, actions }) => {
	const dictionariesQuery = usePipelineDictionaries();
	const [slug, setSlug] = useState<string>(ALL);

	const options = useMemo(
		() => dictionariesQuery.data ?? [],
		[dictionariesQuery.data],
	);

	const onSubmit = () => {
		void actions.runParse(slug === ALL ? null : slug);
	};

	const result = actions.results.parse;

	return (
		<ActionCard
			icon="📥"
			iconTone="parse"
			title={dict.actions.parse.title}
			description={dict.actions.parse.description}
			footer={
				<>
					<select
						aria-label={dict.actions.parse.title}
						value={slug}
						onChange={(e) => setSlug(e.target.value)}
						disabled={actions.pending.parse || actions.isRunning}
						className="h-8 px-3 pr-6 text-xs bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text)] appearance-none min-w-[130px]"
					>
						<option value={ALL}>{dict.actions.parse.allOption}</option>
						{options.map((opt) => (
							<option key={opt.slug} value={opt.slug}>
								{opt.slug}
							</option>
						))}
					</select>
					<button
						type="button"
						onClick={onSubmit}
						disabled={actions.pending.parse || actions.isRunning}
						className="btn btn-sm btn-primary disabled:opacity-40"
					>
						▶ {dict.actions.parse.run}
					</button>
				</>
			}
			result={
				result ? (
					result.ok ? (
						<ActionCardResult tone="ok">
							{dict.results.parse
								.replace("{slug}", result.slug ?? "all")
								.replace(
									"{source}",
									`${result.data.sourceCount ?? "—"}`,
								)
								.replace(
									"{parsed}",
									`${result.data.parsedCount ?? "—"}`,
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
