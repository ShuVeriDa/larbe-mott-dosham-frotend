export type ResetLogLevel = "info" | "ok" | "warn" | "error";

export interface ResetPipelineStatus {
	isRunning: boolean;
	currentOperation: string | null;
	lastRun: {
		operation: string;
		timestamp: string;
		durationSeconds: number;
	} | null;
	unified: {
		entries: number;
		file: string | null;
		fileSizeMb: number | null;
		updatedAt: string | null;
	};
	database: {
		entries: number;
	};
}

export interface UnifiedLogStep {
	step: number;
	slug: string;
	title: string;
	entriesFromDict: number;
	newWords: number;
	enrichedWords: number;
	totalUnifiedEntries: number;
	snapshotFile: string;
	snapshotSizeMb: number;
	snapshotExists: boolean;
}

export interface UnifiedLog {
	steps: UnifiedLogStep[];
	totalSteps: number;
	totalSnapshotSizeMb: number;
	remaining: { slug: string; title: string }[];
	nextRecommended: { slug: string; title: string } | null;
}

export interface ResetLogEntry {
	timestamp: string;
	level: ResetLogLevel;
	operation: string;
	message: string;
	durationSeconds?: number;
}

export interface ResetResult {
	reset: boolean;
	message: string;
	unifiedEntries: number;
	deletedSnapshots: number;
	freedMb: number;
}
