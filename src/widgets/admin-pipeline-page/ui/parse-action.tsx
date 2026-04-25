"use client";

import { usePipelineFullStatus } from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui";
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
	const statusQuery = usePipelineFullStatus();
	const [slug, setSlug] = useState<string>(ALL);

	const options = useMemo(
		() => statusQuery.data?.parsed?.bySlug ?? [],
		[statusQuery.data?.parsed?.bySlug],
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
					<Select
						value={slug}
						onValueChange={setSlug}
						disabled={actions.pending.parse || actions.isRunning}
					>
						<SelectTrigger
							size="sm"
							aria-label={dict.actions.parse.title}
							className="min-w-[130px] text-xs"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL}>
								{dict.actions.parse.allOption}
							</SelectItem>
							{options.map((opt) => (
								<SelectItem key={opt.slug} value={opt.slug}>
									{opt.slug}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
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
