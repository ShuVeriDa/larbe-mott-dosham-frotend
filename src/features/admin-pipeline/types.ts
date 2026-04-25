export type PipelineStage = "parse" | "unify" | "load" | "improve";
export type PipelineLogLevel = "info" | "ok" | "warn" | "err";

export type DictionaryDirection = "nah-ru" | "ru-nah";

export interface PipelineLogEntry {
	id: string;
	level: PipelineLogLevel;
	message: string;
	at: string;
	stage?: PipelineStage;
}

export type LoadSkipReason =
	| "no word"
	| "no meanings"
	| "no nounClass"
	| "duplicate";

export interface LoadSkippedEntry {
	word: string;
	reason: LoadSkipReason | string;
}

export interface PipelineRunResult {
	ok?: boolean;
	message?: string;
	parsedCount?: number;
	sourceCount?: number;
	loaded?: number;
	skipped?: number;
	skippedSample?: LoadSkippedEntry[];
	totalInFile?: number;
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
	total?: number;
	normalizedStyleLabels?: number;
	removedEmptyMeanings?: number;
	removedBrokenExamples?: number;
	normalizedWords?: number;
	truncatedFields?: number;
	deduplicatedMeanings?: number;
	cleanedPhraseology?: number;
	cleanedCitations?: number;
	affectedEntries?: ImproveAffectedEntry[];
}

export type ImproveActionKind =
	| "cleaned style"
	| "fixed example"
	| "fixed encoding"
	| "removed empty"
	| "dedup meanings"
	| "normalized word"
	| "truncated field"
	| string;

export interface ImproveAffectedEntry {
	word: string;
	action: ImproveActionKind;
	source: string;
}

export interface ImproveResult {
	total: number;
	removedEmptyMeanings: number;
	removedBrokenExamples: number;
	normalizedStyleLabels: number;
	normalizedWords: number;
	truncatedFields: number;
	deduplicatedMeanings: number;
	cleanedPhraseology: number;
	cleanedCitations: number;
	elapsedSeconds: number;
	cleaned: number;
	fixedExamples: number;
	removedEmpty: number;
	affectedEntries: ImproveAffectedEntry[];
}

export type ImproveHistoryStatus = "ok" | "err";

export interface ImproveHistoryItem {
	id: number;
	createdAt: string;
	total: number;
	normalizedStyleLabels: number;
	removedEmptyMeanings: number;
	removedBrokenExamples: number;
	normalizedWords: number;
	truncatedFields: number;
	deduplicatedMeanings: number;
	cleanedPhraseology: number;
	cleanedCitations: number;
	elapsedSeconds: number;
	status: ImproveHistoryStatus;
	errorMessage: string | null;
}

export interface LoadHistoryItem {
	id: number;
	createdAt: string;
	loaded: number;
	skipped: number;
	totalInFile: number;
	elapsedSeconds: number;
	status: "ok" | "error";
	errorMessage: string | null;
}

export interface HealthCheckResult {
	status: "ok" | "error" | "shutting_down";
	info?: Record<string, { status: string }>;
	error?: Record<string, { status: string; message?: string }>;
	details?: Record<string, { status: string }>;
}

export interface PipelineParsedFile {
	slug: string;
	filename: string;
	sizeMb: number;
	updatedAt: string;
}

export interface PipelineParsedFilesResponse {
	dir: string;
	count: number;
	files: PipelineParsedFile[];
}

export interface PipelineStatusDictionary {
	slug: string;
	title: string;
	direction: DictionaryDirection;
	count: number | null;
	status: "pending" | "parsed" | "merged";
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
	parsed?: {
		files: number;
		total: number;
		bySlug: PipelineStatusDictionary[];
	};
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
