import type { WordLevel } from "@/entities/dictionary";

export type Level = WordLevel | "ALL";

export const isLevel = (value: unknown): value is WordLevel =>
	value === "A" || value === "B" || value === "C";

export const parseLevelParam = (value: string | undefined | null): Level =>
	isLevel(value) ? value : "ALL";
