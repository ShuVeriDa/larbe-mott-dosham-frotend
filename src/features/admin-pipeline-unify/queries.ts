import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { adminPipelineUnifyApi } from "./api";

export const adminPipelineUnifyKeys = {
	all: ["admin", "pipeline", "unify"] as const,
	status: () => [...adminPipelineUnifyKeys.all, "status"] as const,
	unifiedLog: () => [...adminPipelineUnifyKeys.all, "unified-log"] as const,
};

export const useUnifyStatus = () =>
	useQuery({
		queryKey: adminPipelineUnifyKeys.status(),
		queryFn: adminPipelineUnifyApi.getStatus,
		refetchInterval: (query) =>
			query.state.data?.isRunning ? 2000 : 15000,
		staleTime: 3000,
	});

export const useUnifiedLog = () =>
	useQuery({
		queryKey: adminPipelineUnifyKeys.unifiedLog(),
		queryFn: adminPipelineUnifyApi.getUnifiedLog,
		staleTime: 5000,
	});

export const useRunUnifyStep = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (slug: string) => adminPipelineUnifyApi.runUnifyStep(slug),
		onSettled: () => {
			qc.invalidateQueries({ queryKey: adminPipelineUnifyKeys.all });
		},
	});
};

export const useRollbackStep = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (step: number) => adminPipelineUnifyApi.rollback(step),
		onSettled: () => {
			qc.invalidateQueries({ queryKey: adminPipelineUnifyKeys.all });
		},
	});
};
