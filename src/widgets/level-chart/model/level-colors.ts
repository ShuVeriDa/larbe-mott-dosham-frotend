export type LevelKey = "A" | "B" | "C";

export interface LevelPalette {
	text: string;
	background: string;
	border: string;
}

export const LEVEL_PALETTE: Record<LevelKey, LevelPalette> = {
	A: {
		text: "var(--cefr-a1)",
		background: "var(--cefr-a1-bg)",
		border: "color-mix(in srgb, var(--cefr-a1) 30%, transparent)",
	},
	B: {
		text: "var(--cefr-b1)",
		background: "var(--cefr-b1-bg)",
		border: "color-mix(in srgb, var(--cefr-b1) 30%, transparent)",
	},
	C: {
		text: "var(--cefr-c1)",
		background: "var(--cefr-c1-bg)",
		border: "color-mix(in srgb, var(--cefr-c1) 30%, transparent)",
	},
};

export const isLevelKey = (v: string): v is LevelKey =>
	v === "A" || v === "B" || v === "C";
