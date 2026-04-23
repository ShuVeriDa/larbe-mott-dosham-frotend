"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";
import type { UsePipelineActions } from "../model/use-pipeline-actions";
import { ImproveAction } from "./improve-action";
import { LoadAction } from "./load-action";
import { ParseAction } from "./parse-action";
import { ResetAction } from "./reset-action";
import { RollbackAction } from "./rollback-action";
import { UnifyAction } from "./unify-action";

interface Props {
	dict: Dictionary["admin"]["pipeline"];
	actions: UsePipelineActions;
}

export const PipelineActionsGrid: FC<Props> = ({ dict, actions }) => (
	<section aria-labelledby="pipeline-actions-heading" className="mb-8">
		<h2
			id="pipeline-actions-heading"
			className="text-lg font-semibold text-[var(--text)] mb-4"
		>
			{dict.sections.actions}
		</h2>
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<ParseAction dict={dict} actions={actions} />
			<UnifyAction dict={dict} actions={actions} />
			<LoadAction dict={dict} actions={actions} />
			<ImproveAction dict={dict} actions={actions} />
			<RollbackAction dict={dict} actions={actions} />
			<ResetAction dict={dict} actions={actions} />
		</div>
	</section>
);
