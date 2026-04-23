import { apiClient } from "@/shared/api";
import type {
	ResetLogEntry,
	ResetPipelineStatus,
	ResetResult,
	UnifiedLog,
} from "./types";

export const adminPipelineResetApi = {
	async getStatus(): Promise<ResetPipelineStatus> {
		const { data } = await apiClient.get<ResetPipelineStatus>(
			"/admin/pipeline/status",
		);
		return data;
	},

	async getUnifiedLog(): Promise<UnifiedLog> {
		const { data } = await apiClient.get<UnifiedLog>(
			"/admin/pipeline/unified-log",
		);
		return data;
	},

	async getLog(): Promise<ResetLogEntry[]> {
		const { data } = await apiClient.get<ResetLogEntry[]>(
			"/admin/pipeline/log",
		);
		return data;
	},

	async clearLog(): Promise<{ cleared: true }> {
		const { data } = await apiClient.delete<{ cleared: true }>(
			"/admin/pipeline/log",
		);
		return data;
	},

	async reset(): Promise<ResetResult> {
		const { data } = await apiClient.post<ResetResult>(
			"/admin/pipeline/reset",
		);
		return data;
	},
};
