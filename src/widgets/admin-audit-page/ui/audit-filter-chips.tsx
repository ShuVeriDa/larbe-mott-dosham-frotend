"use client";

import type { AuditAction, AuditStatsCounters } from "@/features/admin-audit";
import type { Dictionary } from "@/i18n/dictionaries";
import { FilterChips, type FilterChipOption } from "@/shared/ui/admin";
import type { FC } from "react";

interface AuditFilterChipsProps {
	value: AuditAction | "";
	onChange: (value: AuditAction | "") => void;
	counts: AuditStatsCounters | undefined;
	dict: Dictionary["admin"]["audit"]["filters"];
}

export const AuditFilterChips: FC<AuditFilterChipsProps> = ({
	value,
	onChange,
	counts,
	dict,
}) => {
	const totalCount = counts
		? counts.create + counts.update + counts.delete + counts.bulk + counts.pipeline
		: undefined;

	const options: FilterChipOption<AuditAction | "">[] = [
		{ value: "", label: dict.all, count: totalCount },
		{ value: "update", label: dict.update, count: counts?.update },
		{ value: "create", label: dict.create, count: counts?.create },
		{ value: "delete", label: dict.delete, count: counts?.delete },
		{ value: "bulk", label: dict.bulk, count: counts?.bulk },
		{ value: "pipeline", label: dict.pipeline, count: counts?.pipeline },
	];

	return (
		<div className="mb-5">
			<FilterChips
				options={options}
				value={value}
				onChange={(v) => onChange(v as AuditAction | "")}
			/>
		</div>
	);
};
