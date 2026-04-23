export const POS_DOT_COLORS = [
	"var(--accent)",
	"var(--success)",
	"var(--warning)",
	"var(--info)",
	"var(--danger)",
	"var(--cefr-c2)",
	"var(--class-bu)",
	"var(--text-muted)",
] as const;

export const posColorAt = (index: number): string =>
	POS_DOT_COLORS[index % POS_DOT_COLORS.length];
