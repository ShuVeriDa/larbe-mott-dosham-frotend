"use client";

import { useMemo } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FilterGroup } from "../types";
import {
	ENTRY_TYPE_KEYS,
	LEVEL_KEYS,
	NOUN_CLASS_KEYS,
	POS_KEYS,
} from "./filter-config";

type FiltersDict = Dictionary["search"]["filters"];

export const useFilterGroups = (
	filtersDict: FiltersDict,
	/** POS values loaded from the API; falls back to hardcoded list. */
	posValues?: readonly string[],
): readonly FilterGroup[] => {
	return useMemo(() => {
		const posList = posValues?.length ? posValues : POS_KEYS;

		const groups: FilterGroup[] = [
			{
				key: "level",
				label: filtersDict.level,
				multi: true,
				options: LEVEL_KEYS.map(v => ({
					value: v,
					label: filtersDict.levels[v],
				})),
			},
			{
				key: "pos",
				label: filtersDict.pos,
				options: [
					{ value: "", label: filtersDict.all },
					...posList.map(v => ({
						value: v,
						label:
							filtersDict.posValues[v as keyof typeof filtersDict.posValues] ??
							v,
					})),
				],
			},
			{
				key: "nounClass",
				label: filtersDict.nounClass,
				options: [
					{ value: "", label: filtersDict.all },
					...NOUN_CLASS_KEYS.map(v => ({
						value: v,
						label: filtersDict.nounClassValues[v],
					})),
				],
			},
			{
				key: "entryType",
				label: filtersDict.entryType,
				options: [
					{ value: "", label: filtersDict.all },
					...ENTRY_TYPE_KEYS.map(v => ({
						value: v,
						label: filtersDict.entryTypes[v],
					})),
				],
			},
		];

		return groups;
	}, [filtersDict, posValues]);
};
