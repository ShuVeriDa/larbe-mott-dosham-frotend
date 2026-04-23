export type UnifyDictStatus = "pending" | "parsed" | "merged";
export type UnifyDirection = "nah-ru" | "ru-nah";

export interface UnifyBySlug {
	slug: string;
	title: string;
	direction: UnifyDirection;
	count: number | null;
	status: UnifyDictStatus;
}

export interface UnifyLastRun {
	operation: string;
	timestamp: string;
	durationSeconds: number;
}

export interface UnifyPipelineStatus {
	isRunning: boolean;
	currentOperation: string | null;
	lastRun: UnifyLastRun | null;
	parsed: {
		files: number;
		total: number;
		bySlug: UnifyBySlug[];
	};
	unified: {
		entries: number;
		file: string | null;
		fileSizeMb: number | null;
		updatedAt: string | null;
	};
	database: { entries: number };
}

export interface UnifyStepEntry {
	step: number;
	slug: string;
	title: string;
	timestamp: string;
	durationSeconds: number;
	entriesFromDict: number;
	newWords: number;
	enrichedWords: number;
	totalUnifiedEntries: number;
	snapshotFile: string;
	snapshotSizeMb: number;
	snapshotExists: boolean;
}

export interface UnifiedLogResponse {
	steps: UnifyStepEntry[];
	totalSteps: number;
	totalSnapshotSizeMb: number;
	remaining: Array<{ slug: string; title: string }>;
	nextRecommended: { slug: string; title: string } | null;
}

export interface UnifyStepResponse {
	step: number;
	slug: string;
	title: string;
	entriesFromDict: number;
	newWords: number;
	enrichedWords: number;
	totalUnifiedEntries: number;
	snapshotFile: string;
	snapshotSizeMb: number;
	nextRecommended: { slug: string; title: string } | null;
}

export interface RollbackResponse {
	rolledBackTo: number;
	currentEntries: number;
	stepsRemoved: number;
	nextRecommended: { slug: string; title: string } | null;
}
