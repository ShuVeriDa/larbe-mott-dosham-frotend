export interface PreviewCountry {
	iso: string;
	count: number;
}

export const PREVIEW_COUNTRIES: ReadonlyArray<PreviewCountry> = [
	{ iso: "RU", count: 10234 },
	{ iso: "KZ", count: 4612 },
	{ iso: "TR", count: 2890 },
	{ iso: "DE", count: 1843 },
	{ iso: "US", count: 1402 },
	{ iso: "AE", count: 824 },
];
