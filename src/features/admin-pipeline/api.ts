import { apiClient } from "@/shared/api";
import type {
	PipelineDictionary,
	PipelineFullStatus,
	PipelineHistoryItem,
	PipelineLogEntry,
	PipelineOperationLogEntry,
	PipelineParsedFile,
	PipelineResetResult,
	PipelineRollbackResult,
	PipelineRunResult,
	PipelineSnapshot,
	PipelineStage,
	PipelineStats,
	PipelineStatus,
	UnifiedLogResponse,
} from "./types";

export const adminPipelineApi = {
	async getStatus(): Promise<PipelineStatus> {
		const { data } = await apiClient.get<PipelineStatus>(
			"/admin/pipeline/status",
		);
		return data;
	},

	async getStats(): Promise<PipelineStats> {
		const { data } = await apiClient.get<PipelineStats>(
			"/admin/pipeline/stats",
		);
		return data;
	},

	async getDictionaries(): Promise<PipelineDictionary[]> {
		const { data } = await apiClient.get<PipelineDictionary[]>(
			"/admin/pipeline/dictionaries",
		);
		return data;
	},

	async getSnapshots(): Promise<PipelineSnapshot[]> {
		const { data } = await apiClient.get<PipelineSnapshot[]>(
			"/admin/pipeline/snapshots",
		);
		return data;
	},

	async getLog(
		stage?: PipelineStage,
		limit = 100,
	): Promise<PipelineLogEntry[]> {
		const { data } = await apiClient.get<PipelineLogEntry[]>(
			"/admin/pipeline/log",
			{ params: stage ? { kind: stage, limit } : { limit } },
		);
		return data;
	},

	async getParsedFiles(): Promise<PipelineParsedFile[]> {
		const { data } = await apiClient.get<PipelineParsedFile[]>(
			"/admin/pipeline/parsed-files",
		);
		return data;
	},

	async getHistory(stage: PipelineStage): Promise<PipelineHistoryItem[]> {
		const { data } = await apiClient.get<PipelineHistoryItem[]>(
			`/admin/pipeline/history/${stage}`,
		);
		return data;
	},

	async runParse(slug?: string): Promise<PipelineRunResult> {
		const { data } = await apiClient.post<PipelineRunResult>(
			`/admin/pipeline/parse/${slug ?? "all"}`,
		);
		return data;
	},

	async runUnifyStep(slug: string): Promise<PipelineRunResult> {
		const { data } = await apiClient.post<PipelineRunResult>(
			`/admin/pipeline/unify-step/${slug}`,
		);
		return data;
	},

	async runLoad(): Promise<PipelineRunResult> {
		const { data } = await apiClient.post<PipelineRunResult>(
			"/admin/pipeline/load",
		);
		return data;
	},

	async runImprove(): Promise<PipelineRunResult> {
		const { data } = await apiClient.post<PipelineRunResult>(
			"/admin/pipeline/improve",
		);
		return data;
	},

	async runImproveEntries(ids: number[]): Promise<PipelineRunResult> {
		const { data } = await apiClient.post<PipelineRunResult>(
			"/admin/pipeline/improve-entries",
			{ ids },
		);
		return data;
	},

	async rollback(step: number): Promise<PipelineRollbackResult> {
		const { data } = await apiClient.post<PipelineRollbackResult>(
			`/admin/pipeline/rollback/${step}`,
		);
		return data;
	},

	async reset(): Promise<PipelineResetResult> {
		const { data } = await apiClient.post<PipelineResetResult>(
			"/admin/pipeline/reset",
		);
		return data;
	},

	async getUnifiedLog(): Promise<UnifiedLogResponse> {
		const { data } = await apiClient.get<UnifiedLogResponse>(
			"/admin/pipeline/unified-log",
		);
		return data;
	},

	async getFullStatus(): Promise<PipelineFullStatus> {
		const { data } = await apiClient.get<PipelineFullStatus>(
			"/admin/pipeline/status",
		);
		return data;
	},

	async getOperationLog(limit = 100): Promise<PipelineOperationLogEntry[]> {
		const { data } = await apiClient.get<PipelineOperationLogEntry[]>(
			"/admin/pipeline/log",
			{ params: { limit } },
		);
		return data;
	},

	async clearOperationLog(): Promise<{ cleared: true }> {
		const { data } = await apiClient.delete<{ cleared: true }>(
			"/admin/pipeline/log",
		);
		return data;
	},
};
