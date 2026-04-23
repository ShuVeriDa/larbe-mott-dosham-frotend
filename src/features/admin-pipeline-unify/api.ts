import { apiClient } from "@/shared/api";
import type {
	RollbackResponse,
	UnifiedLogResponse,
	UnifyPipelineStatus,
	UnifyStepResponse,
} from "./types";

export const adminPipelineUnifyApi = {
	async getStatus(): Promise<UnifyPipelineStatus> {
		const { data } = await apiClient.get<UnifyPipelineStatus>(
			"/admin/pipeline/status",
		);
		return data;
	},

	async getUnifiedLog(): Promise<UnifiedLogResponse> {
		const { data } = await apiClient.get<UnifiedLogResponse>(
			"/admin/pipeline/unified-log",
		);
		return data;
	},

	async runUnifyStep(slug: string): Promise<UnifyStepResponse> {
		const { data } = await apiClient.post<UnifyStepResponse>(
			`/admin/pipeline/unify-step/${slug}`,
		);
		return data;
	},

	async rollback(step: number): Promise<RollbackResponse> {
		const { data } = await apiClient.post<RollbackResponse>(
			`/admin/pipeline/rollback/${step}`,
		);
		return data;
	},
};
