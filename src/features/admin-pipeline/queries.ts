import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { adminPipelineApi } from "./api";
import type { PipelineStage } from "./types";

export const adminPipelineKeys = {
	all: ["admin", "pipeline"] as const,
	fullStatus: () => [...adminPipelineKeys.all, "full-status"] as const,
	unifiedLog: () => [...adminPipelineKeys.all, "unified-log"] as const,
	operationLog: () => [...adminPipelineKeys.all, "operation-log"] as const,
	log: (stage?: PipelineStage) =>
		[...adminPipelineKeys.all, "log", stage ?? "all"] as const,
	parsedFiles: () => [...adminPipelineKeys.all, "parsed-files"] as const,
	loadHistory: (limit: number) =>
		[...adminPipelineKeys.all, "load-history", limit] as const,
	improveHistory: (limit: number) =>
		[...adminPipelineKeys.all, "improve-history", limit] as const,
	health: () => [...adminPipelineKeys.all, "health"] as const,
};

interface Options {
	enabled?: boolean;
}

export const usePipelineLog = (
	stage?: PipelineStage,
	options: Options = {},
) =>
	useQuery({
		queryKey: adminPipelineKeys.log(stage),
		queryFn: () => adminPipelineApi.getLog(stage),
		enabled: options.enabled ?? true,
		refetchInterval: 5000,
		staleTime: 5 * 1000,
	});

export const usePipelineParsedFiles = (options: Options = {}) =>
	useQuery({
		queryKey: adminPipelineKeys.parsedFiles(),
		queryFn: adminPipelineApi.getParsedFiles,
		enabled: options.enabled ?? true,
		staleTime: 30 * 1000,
	});

const invalidateAll = (qc: ReturnType<typeof useQueryClient>) => {
	qc.invalidateQueries({ queryKey: adminPipelineKeys.all });
};

export const useRunParse = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ slug }: { slug?: string }) =>
			adminPipelineApi.runParse(slug),
		onSuccess: () => invalidateAll(qc),
	});
};

export const useRunUnifyStep = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ slug }: { slug: string }) =>
			adminPipelineApi.runUnifyStep(slug),
		onSuccess: () => invalidateAll(qc),
	});
};

export const useRunLoad = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => adminPipelineApi.runLoad(),
		onSuccess: () => invalidateAll(qc),
	});
};

export const useRunImprove = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => adminPipelineApi.runImprove(),
		onSuccess: () => invalidateAll(qc),
	});
};

export const useRunImproveEntries = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ ids }: { ids: number[] }) =>
			adminPipelineApi.runImproveEntries(ids),
		onSuccess: () => invalidateAll(qc),
	});
};

export const useRollbackPipeline = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ step }: { step: number }) =>
			adminPipelineApi.rollback(step),
		onSuccess: () => invalidateAll(qc),
	});
};

export const useResetPipeline = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => adminPipelineApi.reset(),
		onSuccess: () => invalidateAll(qc),
	});
};

export const useUnifiedLog = (options: Options = {}) =>
	useQuery({
		queryKey: adminPipelineKeys.unifiedLog(),
		queryFn: adminPipelineApi.getUnifiedLog,
		enabled: options.enabled ?? true,
		staleTime: 15 * 1000,
	});

export const usePipelineFullStatus = (options: Options = {}) =>
	useQuery({
		queryKey: adminPipelineKeys.fullStatus(),
		queryFn: adminPipelineApi.getFullStatus,
		enabled: options.enabled ?? true,
		refetchInterval: (query) =>
			query.state.data?.isRunning ? 2000 : false,
		staleTime: 5 * 1000,
	});

export const usePipelineOperationLog = (options: Options = {}) =>
	useQuery({
		queryKey: adminPipelineKeys.operationLog(),
		queryFn: () => adminPipelineApi.getOperationLog(),
		enabled: options.enabled ?? true,
		refetchInterval: 5000,
		staleTime: 5 * 1000,
	});

export const useClearPipelineOperationLog = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => adminPipelineApi.clearOperationLog(),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: adminPipelineKeys.operationLog() });
		},
	});
};

export const useLoadHistory = (limit = 20, options: Options = {}) =>
	useQuery({
		queryKey: adminPipelineKeys.loadHistory(limit),
		queryFn: () => adminPipelineApi.getLoadHistory(limit),
		enabled: options.enabled ?? true,
		staleTime: 15 * 1000,
	});

export const useImproveHistory = (limit = 20, options: Options = {}) =>
	useQuery({
		queryKey: adminPipelineKeys.improveHistory(limit),
		queryFn: () => adminPipelineApi.getImproveHistory(limit),
		enabled: options.enabled ?? true,
		staleTime: 15 * 1000,
	});

export const useHealthCheck = (options: Options = {}) =>
	useQuery({
		queryKey: adminPipelineKeys.health(),
		queryFn: adminPipelineApi.getHealth,
		enabled: options.enabled ?? true,
		refetchInterval: 30 * 1000,
		staleTime: 10 * 1000,
	});
