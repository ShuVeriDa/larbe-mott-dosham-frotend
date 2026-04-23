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

export const UnifyAction: FC<Props> = ({ dict, actions }) => {
	const logQuery = useUnifiedLog();
	const remaining = logQuery.data?.remaining ?? [];
	const [slug, setSlug] = useState<string>("");

	useEffect(() => {
		if (!slug && remaining[0]) setSlug(remaining[0].slug);
	}, [remaining, slug]);

	const onSubmit = () => {
		if (!slug) return;
		void actions.runUnify(slug);
	};

	const result = actions.results.unify;
	const isEmpty = remaining.length === 0;

	return (
		<ActionCard
			icon="🔗"
			iconTone="unify"
			title={dict.actions.unify.title}
			description={dict.actions.unify.description}
			footer={
				<>
					<select
						aria-label={dict.actions.unify.title}
						value={slug}
						onChange={(e) => setSlug(e.target.value)}
						disabled={isEmpty || actions.pending.unify || actions.isRunning}
						className="h-8 px-3 pr-6 text-xs bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text)] appearance-none min-w-[130px] disabled:opacity-40"
					>
						{isEmpty ? (
							<option>{dict.actions.unify.empty}</option>
						) : (
							remaining.map((opt) => (
								<option key={opt.slug} value={opt.slug}>
									{opt.slug}
								</option>
							))
						)}
					</select>
					<button
						type="button"
						onClick={onSubmit}
						disabled={
							isEmpty || actions.pending.unify || actions.isRunning || !slug
						}
						className="btn btn-sm btn-primary disabled:opacity-40"
					>
						🔗 {dict.actions.unify.run}
					</button>
				</>
			}
			result={
				result ? (
					result.ok ? (
						<ActionCardResult tone="ok">
							{dict.results.unify
								.replace("{new}", `${result.data.newWords ?? "—"}`)
								.replace(
									"{enriched}",
									`${result.data.enrichedWords ?? "—"}`,
								)
								.replace(
									"{total}",
									`${result.data.totalUnifiedEntries ?? "—"}`,
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
