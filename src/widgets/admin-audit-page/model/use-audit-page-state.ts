"use client";

import type {
	AuditAction,
	AuditActorType,
	AuditPeriod,
} from "@/features/admin-audit";
import { useDebounce } from "@/shared/lib";
import { useState } from "react";

const PAGE_SIZE = 20;

export interface AuditPageState {
	q: string;
	setQ: (value: string) => void;
	debouncedQ: string;
	action: AuditAction | "";
	setAction: (value: AuditAction | "") => void;
	actorType: AuditActorType | "";
	setActorType: (value: AuditActorType | "") => void;
	period: AuditPeriod;
	setPeriod: (value: AuditPeriod) => void;
	page: number;
	setPage: (value: number) => void;
	resetPageAnd: <T extends (...args: never[]) => void>(fn: T) => T;
	pageSize: number;
}

export const useAuditPageState = (): AuditPageState => {
	const [q, setQRaw] = useState("");
	const [action, setActionRaw] = useState<AuditAction | "">("");
	const [actorType, setActorTypeRaw] = useState<AuditActorType | "">("");
	const [period, setPeriodRaw] = useState<AuditPeriod>("week");
	const [page, setPage] = useState(1);

	const debouncedQ = useDebounce(q, 300);

	const withReset =
		<T extends (...args: never[]) => void>(fn: T): T =>
			((...args: Parameters<T>) => {
				setPage(1);
				fn(...args);
			}) as T;

	return {
		q,
		setQ: withReset(setQRaw),
		debouncedQ,
		action,
		setAction: withReset(setActionRaw),
		actorType,
		setActorType: withReset(setActorTypeRaw),
		period,
		setPeriod: withReset(setPeriodRaw),
		page,
		setPage,
		resetPageAnd: withReset,
		pageSize: PAGE_SIZE,
	};
};
