"use client";

import type {
	AuditAction,
	AuditActorType,
	AuditPeriod,
} from "@/features/admin-audit";
import type { Dictionary } from "@/i18n/dictionaries";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui";
import type { FC, ReactNode } from "react";

interface AuditToolbarProps {
	q: string;
	onQChange: (value: string) => void;
	action: AuditAction | "";
	onActionChange: (value: AuditAction | "") => void;
	actorType: AuditActorType | "";
	onActorTypeChange: (value: AuditActorType | "") => void;
	period: AuditPeriod;
	onPeriodChange: (value: AuditPeriod) => void;
	dict: Dictionary["admin"]["audit"]["toolbar"];
	filtersDict: Dictionary["admin"]["audit"]["filters"];
	trailing?: ReactNode;
}

const inputClass =
	"bg-[var(--surface)] border border-[var(--border)] rounded-md px-3 py-2 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-dim)]";

const ALL = "__all__";
const triggerClass = "h-[38px] min-w-[140px]";

export const AuditToolbar: FC<AuditToolbarProps> = ({
	q,
	onQChange,
	action,
	onActionChange,
	actorType,
	onActorTypeChange,
	period,
	onPeriodChange,
	dict,
	filtersDict,
	trailing,
}) => {
	return (
		<div className="flex flex-wrap items-center gap-3 mb-4">
			<div className="relative flex-1 min-w-[200px] max-w-[320px]">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
					aria-hidden
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.35-4.35" />
				</svg>
				<input
					type="text"
					value={q}
					onChange={(e) => onQChange(e.target.value)}
					placeholder={dict.searchPlaceholder}
					className={`${inputClass} w-full pl-9`}
					aria-label={dict.searchPlaceholder}
				/>
			</div>
			<Select
				value={action === "" ? ALL : action}
				onValueChange={(value) =>
					onActionChange(value === ALL ? "" : (value as AuditAction))
				}
			>
				<SelectTrigger
					className={triggerClass}
					aria-label={dict.allActions}
				>
					<SelectValue placeholder={dict.allActions} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL}>{dict.allActions}</SelectItem>
					<SelectItem value="create">{filtersDict.create}</SelectItem>
					<SelectItem value="update">{filtersDict.update}</SelectItem>
					<SelectItem value="delete">{filtersDict.delete}</SelectItem>
					<SelectItem value="bulk">{filtersDict.bulk}</SelectItem>
					<SelectItem value="pipeline">{filtersDict.pipeline}</SelectItem>
				</SelectContent>
			</Select>
			<Select
				value={actorType === "" ? ALL : actorType}
				onValueChange={(value) =>
					onActorTypeChange(value === ALL ? "" : (value as AuditActorType))
				}
			>
				<SelectTrigger
					className={triggerClass}
					aria-label={dict.allAuthors}
				>
					<SelectValue placeholder={dict.allAuthors} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL}>{dict.allAuthors}</SelectItem>
					<SelectItem value="admin">{dict.actors.admin}</SelectItem>
					<SelectItem value="pipeline">{dict.actors.pipeline}</SelectItem>
					<SelectItem value="api">{dict.actors.api}</SelectItem>
				</SelectContent>
			</Select>
			<Select
				value={period}
				onValueChange={(value) => onPeriodChange(value as AuditPeriod)}
			>
				<SelectTrigger
					className={triggerClass}
					aria-label={dict.periods.week}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="today">{dict.periods.today}</SelectItem>
					<SelectItem value="week">{dict.periods.week}</SelectItem>
					<SelectItem value="month">{dict.periods.month}</SelectItem>
					<SelectItem value="all">{dict.periods.all}</SelectItem>
				</SelectContent>
			</Select>
			{trailing ? <div className="ml-auto">{trailing}</div> : null}
		</div>
	);
};
