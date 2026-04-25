import { apiClient } from "@/shared/api";
import type {
	HealthCheckResult,
	ImproveHistoryItem,
	ImproveResult,
	LoadHistoryItem,
	PipelineFullStatus,
	PipelineLogEntry,
	PipelineOperationLogEntry,
	PipelineParsedFile,
	PipelineParsedFilesResponse,
	PipelineResetResult,
	PipelineRollbackResult,
	PipelineRunResult,
	PipelineStage,
	UnifiedLogResponse,
} from "./types";

export const adminPipelineApi = {
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
		const { data } = await apiClient.get<PipelineParsedFilesResponse>(
			"/admin/pipeline/parsed-files",
		);
		return data.files;
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

	async runImprove(): Promise<ImproveResult> {
		const { data } = await apiClient.post<ImproveResult>(
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

	async getImproveHistory(limit = 20): Promise<ImproveHistoryItem[]> {
		const { data } = await apiClient.get<ImproveHistoryItem[]>(
			"/admin/pipeline/improve-history",
			{ params: { limit } },
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

	async getLoadHistory(limit = 20): Promise<LoadHistoryItem[]> {
		const { data } = await apiClient.get<LoadHistoryItem[]>(
			"/admin/pipeline/load-history",
			{ params: { limit } },
		);
		return data;
	},

	async getHealth(): Promise<HealthCheckResult> {
		const { data } = await apiClient.get<HealthCheckResult>("/health");
		return data;
	},
};
