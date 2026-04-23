export type PipelineStage = "parse" | "unify" | "load" | "improve";
export type PipelineStatusState = "idle" | "running" | "done" | "error";
export type PipelineLogLevel = "info" | "ok" | "warn" | "err";

export interface PipelineStatus {
	state: PipelineStatusState;
	action?: string;
	detail?: string;
	elapsedMs?: number;
	startedAt?: string;
	finishedAt?: string;
}

export interface PipelineStats {
	parsedFiles: number;
	totalFiles: number;
	unifiedRecords: number;
	inDb: number;
	mergeSteps: number;
	skipped?: number;
}

export type PipelineDictStatus =
	| "merged"
	| "parsed"
	| "pending"
	| "running"
	| "error";

export type DictionaryDirection = "nah-ru" | "ru-nah";

export interface PipelineDictionary {
	slug: string;
	title: string;
	direction: DictionaryDirection;
	status: PipelineDictStatus;
	recordCount: number;
	fromDict?: number;
	newWords?: number;
	enriched?: number;
	duplicates?: number;
	stepNumber?: number;
}

export interface PipelineLogEntry {
	id: string;
	level: PipelineLogLevel;
	message: string;
	at: string;
	stage?: PipelineStage;
}

export interface PipelineSnapshot {
	step: number;
	label: string;
	recordCount: number;
	sizeBytes: number;
	createdAt: string;
	isCurrent: boolean;
}

export interface PipelineRunResult {
	ok?: boolean;
	message?: string;
	parsedCount?: number;
	sourceCount?: number;
	loaded?: number;
	skipped?: number;
	elapsedMs?: number;
	elapsedSeconds?: number;
	slug?: string;
	title?: string;
	step?: number;
	entriesFromDict?: number;
	newWords?: number;
	enrichedWords?: number;
	totalUnifiedEntries?: number;
	cleaned?: number;
	fixedExamples?: number;
	removedEmpty?: number;
}

export interface PipelineParsedFile {
	name: string;
	path: string;
	sizeBytes: number;
	updatedAt: string;
	recordCount: number;
}

export interface PipelineHistoryItem {
	date: string;
	loaded?: number;
	skipped?: number;
	elapsedMs?: number;
	status: "ok" | "err";
	stage: PipelineStage;
}

export interface MergeLogEntry {
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
	steps: MergeLogEntry[];
	totalSteps: number;
	totalSnapshotSizeMb: number;
	remaining: Array<{ slug: string; title: string }>;
	nextRecommended: { slug: string; title: string } | null;
}

export interface PipelineFullStatus {
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
	database: { entries: number };
}

export interface PipelineRollbackResult {
	rolledBackTo: number;
	currentEntries: number;
	stepsRemoved: number;
	backupFile: string | null;
	nextRecommended: { slug: string; title: string } | null;
}

export interface PipelineResetResult {
	reset: boolean;
	message: string;
	unifiedEntries: number;
	deletedSnapshots: number;
	freedMb: number;
}

export interface PipelineOperationLogEntry {
	timestamp: string;
	level: PipelineLogLevel;
	operation: string;
	message: string;
	durationSeconds?: number;
}
