"use client";

import { cn } from "@/shared/lib";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";

interface Props {
	dict: Dictionary["admin"]["pipeline"];
}

type Tone = "parse" | "unify" | "improve" | "load";

const BADGE: Record<Tone, string> = {
	parse:   "bg-[var(--accent-dim)]  text-[var(--accent)]  border-[var(--accent)]",
	unify:   "bg-[var(--info-dim)]    text-[var(--info)]    border-[var(--info)]",
	improve: "bg-[var(--warning-dim)] text-[var(--warning)] border-[var(--warning)]",
	load:    "bg-[var(--success-dim)] text-[var(--success)] border-[var(--success)]",
};

const CARD_BORDER: Record<Tone, string> = {
	parse:   "border-l-[var(--accent)]",
	unify:   "border-l-[var(--info)]",
	improve: "border-l-[var(--warning)]",
	load:    "border-l-[var(--success)]",
};

interface StepData {
	icon: string;
	tone: Tone;
	title: string;
	desc: string;
	cli: string;
	check?: string;
}

interface SideStep {
	icon: string;
	title: string;
	desc: string;
	cli: string;
	check?: string;
}

interface MaintenanceStep {
	icon: string;
	title: string;
	desc: string;
	cli: string;
	danger?: boolean;
}

const CliRow: FC<{ label: string; code: string }> = ({ label, code }) => (
	<div className="flex items-center gap-2">
		<span className="text-[10px] font-medium uppercase tracking-wide text-(--text-muted) w-16 shrink-0">
			{label}
		</span>
		<code className="text-[11px] font-mono bg-surface-active text-subtle px-2 py-0.5 rounded-md">
			{code}
		</code>
	</div>
);

const MainStep: FC<{
	step: StepData;
	number: number;
	isLast: boolean;
	checkLabel: string;
	cliLabel: string;
}> = ({ step, number, isLast, checkLabel, cliLabel }) => (
	<li className="flex gap-4">
		<div className="flex flex-col items-center shrink-0">
			<div
				className={cn(
					"w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold",
					BADGE[step.tone],
				)}
				aria-hidden
			>
				{number}
			</div>
			{!isLast && <div className="w-px flex-1 bg-(--border) my-1" />}
		</div>

		<div
			className={cn(
				"mb-3 flex-1 bg-(--surface) border border-(--border) border-l-2 rounded-xl p-4",
				"hover:bg-surface-hover transition-colors",
				CARD_BORDER[step.tone],
			)}
		>
			<div className="flex items-center gap-2 mb-1">
				<span aria-hidden className="text-base leading-none">{step.icon}</span>
				<span className="text-sm font-semibold text-(--text)">{step.title}</span>
			</div>
			<p className="text-xs text-(--text-muted) leading-relaxed mb-3">{step.desc}</p>
			<div className="flex flex-col gap-1.5">
				<CliRow label={cliLabel} code={step.cli} />
				{step.check && <CliRow label={checkLabel} code={step.check} />}
			</div>
		</div>
	</li>
);

const SideCard: FC<{ step: SideStep; checkLabel: string; cliLabel: string }> = ({
	step,
	checkLabel,
	cliLabel,
}) => (
	<div className="bg-(--surface) border border-(--border) rounded-xl p-4 flex flex-col gap-2 hover:bg-surface-hover transition-colors">
		<div className="flex items-center gap-2">
			<span aria-hidden className="text-base leading-none">{step.icon}</span>
			<span className="text-sm font-semibold text-(--text)">{step.title}</span>
		</div>
		<p className="text-xs text-(--text-muted) leading-relaxed">{step.desc}</p>
		<div className="flex flex-col gap-1.5 mt-auto pt-1">
			<CliRow label={cliLabel} code={step.cli} />
			{step.check && <CliRow label={checkLabel} code={step.check} />}
		</div>
	</div>
);

const MaintenanceCard: FC<{ step: MaintenanceStep; cliLabel: string }> = ({ step, cliLabel }) => (
	<div
		className={cn(
			"bg-(--surface) border border-(--border) rounded-xl p-4 flex flex-col gap-2",
			"hover:bg-surface-hover transition-colors",
			step.danger && "border-danger-dim",
		)}
	>
		<div className="flex items-center gap-2">
			<span aria-hidden className="text-base leading-none">{step.icon}</span>
			<span
				className={cn(
					"text-sm font-semibold",
					step.danger ? "text-(--danger)" : "text-(--text)",
				)}
			>
				{step.title}
			</span>
		</div>
		<p className="text-xs text-(--text-muted) leading-relaxed">{step.desc}</p>
		<div className="mt-auto pt-1">
			<CliRow label={cliLabel} code={step.cli} />
		</div>
	</div>
);

export const PipelineGuide: FC<Props> = ({ dict }) => {
	const a = dict.actions;
	const g = dict.guide;

	const mainSteps: StepData[] = [
		{
			icon:  "📥",
			tone:  "parse",
			title: a.parse.title,
			desc:  a.parse.description,
			cli:   "npm run pipeline:parse-all",
			check: "GET /api/merge/preview/<slug>",
		},
		{
			icon:  "🔗",
			tone:  "unify",
			title: a.unify.title,
			desc:  a.unify.description,
			cli:   "npm run pipeline:unify-all",
			check: "GET /api/merge/unified-log",
		},
		{
			icon:  "🧹",
			tone:  "improve",
			title: a.improve.title,
			desc:  a.improve.description,
			cli:   "npm run pipeline:improve",
		},
		{
			icon:  "🗄",
			tone:  "load",
			title: a.load.title,
			desc:  a.load.description,
			cli:   "npm run pipeline:load",
			check: "GET /api/dictionary/stats",
		},
	];

	const phraseologySteps: SideStep[] = [
		{
			icon:  "📜",
			title: g.parsePhraseology.title,
			desc:  g.parsePhraseology.desc,
			cli:   "npm run pipeline -- parse-phraseology all",
		},
		{
			icon:  "📂",
			title: g.loadPhraseology.title,
			desc:  g.loadPhraseology.desc,
			cli:   "npm run pipeline -- load-phraseology",
			check: "GET /api/dictionary/phraseology?limit=20",
		},
	];

	const maintenanceSteps: MaintenanceStep[] = [
		{
			icon:  "⏪",
			title: a.rollback.title,
			desc:  a.rollback.description,
			cli:   "npm run pipeline -- rollback <step>",
		},
		{
			icon:   "💥",
			title:  a.reset.title,
			desc:   a.reset.description,
			cli:    "npm run pipeline:reset",
			danger: true,
		},
	];

	return (
		<section aria-labelledby="pipeline-guide-heading" className="mb-8">
			<h2
				id="pipeline-guide-heading"
				className="text-lg font-semibold text-(--text) mb-4"
			>
				{g.title}
			</h2>

			<div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
				{/* left: main pipeline + maintenance */}
				<div className="flex flex-col gap-6">
					<div>
						<p className="text-[10px] font-semibold uppercase tracking-widest text-(--text-muted) mb-3">
							{g.mainLabel}
						</p>
						<ol className="list-none m-0 p-0">
							{mainSteps.map((step, i) => (
								<MainStep
									key={step.tone}
									step={step}
									number={i + 1}
									isLast={i === mainSteps.length - 1}
									cliLabel={g.cli}
									checkLabel={g.checkAfter}
								/>
							))}
						</ol>
					</div>

					<div>
						<p className="text-[10px] font-semibold uppercase tracking-widest text-(--text-muted) mb-3">
							{g.maintenanceLabel}
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{maintenanceSteps.map((step) => (
								<MaintenanceCard key={step.title} step={step} cliLabel={g.cli} />
							))}
						</div>
					</div>
				</div>

				{/* right: phraseology branch */}
				<div>
					<p className="text-[10px] font-semibold uppercase tracking-widest text-(--text-muted) mb-1">
						{g.phraseologyLabel}
					</p>
					<p className="text-[11px] text-(--text-muted) italic mb-3">{g.parallel}</p>
					<div className="flex flex-col gap-1">
						{phraseologySteps.map((step, i) => (
							<div key={step.title}>
								<SideCard step={step} cliLabel={g.cli} checkLabel={g.checkAfter} />
								{i < phraseologySteps.length - 1 && (
									<div className="flex justify-center py-1">
										<div className="w-px h-4 bg-(--border)" />
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
