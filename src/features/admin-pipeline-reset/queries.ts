import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { adminPipelineResetApi } from "./api";

export const adminPipelineResetKeys = {
	all: ["admin", "pipeline-reset"] as const,
	status: () => [...adminPipelineResetKeys.all, "status"] as const,
	unifiedLog: () => [...adminPipelineResetKeys.all, "unified-log"] as const,
	log: () => [...adminPipelineResetKeys.all, "log"] as const,
};

export const useResetPipelineStatus = () =>
	useQuery({
		queryKey: adminPipelineResetKeys.status(),
		queryFn: adminPipelineResetApi.getStatus,
		refetchInterval: (query) =>
			query.state.data?.isRunning ? 2000 : false,
		staleTime: 5_000,
	});

export const useUnifiedLog = () =>
	useQuery({
		queryKey: adminPipelineResetKeys.unifiedLog(),
		queryFn: adminPipelineResetApi.getUnifiedLog,
		staleTime: 5_000,
	});

export const useResetLog = () =>
	useQuery({
		queryKey: adminPipelineResetKeys.log(),
		queryFn: adminPipelineResetApi.getLog,
		refetchInterval: 5_000,
		staleTime: 2_000,
	});

export const useClearResetLog = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => adminPipelineResetApi.clearLog(),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: adminPipelineResetKeys.log() });
		},
	});
};

export const useResetPipeline = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => adminPipelineResetApi.reset(),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: adminPipelineResetKeys.all });
		},
	});
};
