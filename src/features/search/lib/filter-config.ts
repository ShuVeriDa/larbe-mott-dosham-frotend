import type { FilterGroup, FilterValues } from "../types";

export const FILTER_GROUPS: readonly FilterGroup[] = [
	{
		key: "cefr",
		label: "Уровень",
		options: [
			{ value: "", label: "Все" },
			{ value: "A", label: "A — базовая лексика" },
			{ value: "B", label: "B — повседневная" },
			{ value: "C", label: "C — редкая" },
		],
	},
	{
		key: "pos",
		label: "Часть речи",
		options: [
			{ value: "", label: "Все" },
			{ value: "сущ.", label: "Существительное" },
			{ value: "гл.", label: "Глагол" },
			{ value: "прил.", label: "Прилагательное" },
			{ value: "нареч.", label: "Наречие" },
			{ value: "послелог", label: "Послелог" },
			{ value: "частица", label: "Частица" },
		],
	},
	{
		key: "nounClass",
		label: "Класс",
		options: [
			{ value: "", label: "Все" },
			{ value: "ву", label: "ву" },
			{ value: "йу", label: "йу" },
			{ value: "ду", label: "ду" },
			{ value: "бу", label: "бу" },
		],
	},
	{
		key: "entryType",
		label: "Тип",
		options: [
			{ value: "", label: "Все" },
			{ value: "standard", label: "Стандартное" },
			{ value: "neologism", label: "Неологизм" },
		],
	},
] as const;

export const EMPTY_FILTERS: FilterValues = {
	cefr: "",
	pos: "",
	nounClass: "",
	entryType: "",
};
