"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui";
import { SectionCard } from "@/shared/ui/admin";
import type { FC } from "react";
import type { FilterDraft } from "../model";

interface Props {
	value: FilterDraft;
	onChange: (patch: Partial<FilterDraft>) => void;
	onSubmit: () => void;
	loading: boolean;
	dict: Dictionary["admin"]["entriesBulk"]["select"]["filter"];
}

const POS_OPTIONS = ["сущ.", "гл.", "прил.", "нар."];
const NOUN_CLASS_OPTIONS = ["ву", "йу", "ду", "бу"];
const SOURCE_OPTIONS = [
	"maciev",
	"baisultanov-nah-ru",
	"ismailov-nah-ru",
	"karasaev-maciev-ru-nah",
	"aliroev",
];
const LEVEL_OPTIONS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const PROBLEM_OPTIONS = ["no-meanings", "no-class", "no-pos", "no-examples"];

const ALL = "__all__";
const triggerClass = "h-10 w-full";

export const BulkMethodFilter: FC<Props> = ({
	value,
	onChange,
	onSubmit,
	loading,
	dict,
}) => (
	<SectionCard title={dict.title}>
		<p className="text-xs text-[var(--text-muted)] -mt-2 mb-4">
			{dict.description}
		</p>
		<form
			className="grid gap-4 md:grid-cols-2"
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit();
			}}
		>
			<div className="flex flex-col gap-2">
				<span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
					{dict.pos}
				</span>
				<Select
					value={value.pos === "" ? ALL : value.pos}
					onValueChange={(next) =>
						onChange({ pos: next === ALL ? "" : next })
					}
				>
					<SelectTrigger className={triggerClass} aria-label={dict.pos}>
						<SelectValue placeholder={dict.all} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>{dict.all}</SelectItem>
						{POS_OPTIONS.map((o) => (
							<SelectItem key={o} value={o}>
								{o}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-col gap-2">
				<span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
					{dict.nounClass}
				</span>
				<Select
					value={value.nounClass === "" ? ALL : value.nounClass}
					onValueChange={(next) =>
						onChange({ nounClass: next === ALL ? "" : next })
					}
				>
					<SelectTrigger className={triggerClass} aria-label={dict.nounClass}>
						<SelectValue placeholder={dict.all} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>{dict.all}</SelectItem>
						{NOUN_CLASS_OPTIONS.map((o) => (
							<SelectItem key={o} value={o}>
								{o}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-col gap-2">
				<span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
					{dict.source}
				</span>
				<Select
					value={value.source === "" ? ALL : value.source}
					onValueChange={(next) =>
						onChange({ source: next === ALL ? "" : next })
					}
				>
					<SelectTrigger className={triggerClass} aria-label={dict.source}>
						<SelectValue placeholder={dict.all} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>{dict.all}</SelectItem>
						{SOURCE_OPTIONS.map((o) => (
							<SelectItem key={o} value={o}>
								{o}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-col gap-2">
				<span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
					{dict.level}
				</span>
				<Select
					value={value.level === "" ? ALL : value.level}
					onValueChange={(next) =>
						onChange({ level: next === ALL ? "" : next })
					}
				>
					<SelectTrigger className={triggerClass} aria-label={dict.level}>
						<SelectValue placeholder={dict.all} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>{dict.all}</SelectItem>
						{LEVEL_OPTIONS.map((o) => (
							<SelectItem key={o} value={o}>
								{o}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-col gap-2">
				<span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
					{dict.problems}
				</span>
				<Select
					value={value.problem === "" ? ALL : value.problem}
					onValueChange={(next) =>
						onChange({ problem: next === ALL ? "" : next })
					}
				>
					<SelectTrigger className={triggerClass} aria-label={dict.problems}>
						<SelectValue placeholder={dict.noFilter} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>{dict.noFilter}</SelectItem>
						{PROBLEM_OPTIONS.map((o) => (
							<SelectItem key={o} value={o}>
								{o}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-end">
				<button
					type="submit"
					disabled={loading}
					className="h-10 w-full md:w-auto px-5 rounded-md bg-[var(--accent)] text-[var(--accent-on)] text-sm font-semibold hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed transition-[filter,box-shadow] hover:shadow-[0_0_12px_var(--accent-glow)]"
				>
					{dict.find}
				</button>
			</div>
		</form>
	</SectionCard>
);
