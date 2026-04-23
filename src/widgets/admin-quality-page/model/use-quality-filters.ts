"use client";

import type { QualityProblemType } from "@/features/admin-quality";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ALLOWED_TYPES: readonly QualityProblemType[] = [
	"no-meanings",
	"no-class",
	"no-pos",
	"no-examples",
];

const parseType = (value: string | null): QualityProblemType | "" => {
	if (!value) return "";
	return ALLOWED_TYPES.includes(value as QualityProblemType)
		? (value as QualityProblemType)
		: "";
};

export interface QualityFiltersState {
	type: QualityProblemType | "";
	searchInput: string;
	source: string;
	page: number;
}

export interface QualityFiltersApi extends QualityFiltersState {
	setType: (type: QualityProblemType | "") => void;
	setSearchInput: (value: string) => void;
	setSource: (source: string) => void;
	setPage: (page: number) => void;
	resetToFirstPage: () => void;
}

export const useQualityFilters = (): QualityFiltersApi => {
	const searchParams = useSearchParams();
	const initialType = parseType(searchParams.get("type"));

	const [type, setTypeRaw] = useState<QualityProblemType | "">(initialType);
	const [searchInput, setSearchInput] = useState("");
	const [source, setSourceRaw] = useState("");
	const [page, setPage] = useState(1);

	useEffect(() => {
		setTypeRaw(parseType(searchParams.get("type")));
	}, [searchParams]);

	const setType = (value: QualityProblemType | "") => {
		setTypeRaw(value);
		setPage(1);
	};

	const setSource = (value: string) => {
		setSourceRaw(value);
		setPage(1);
	};

	const resetToFirstPage = () => setPage(1);

	return {
		type,
		searchInput,
		source,
		page,
		setType,
		setSearchInput,
		setSource,
		setPage,
		resetToFirstPage,
	};
};
