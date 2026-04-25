import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { adminApiKeysApi } from "./api";
import type { CreateApiKeyDto, UpdateApiKeyDto } from "./types";

export const adminApiKeysKeys = {
	all: ["admin", "api-keys"] as const,
	list: () => [...adminApiKeysKeys.all, "list"] as const,
};

interface Options {
	enabled?: boolean;
}

export const useAdminApiKeys = (options: Options = {}) =>
	useQuery({
		queryKey: adminApiKeysKeys.list(),
		queryFn: adminApiKeysApi.getList,
		enabled: options.enabled ?? true,
		staleTime: 30 * 1000,
	});

export const useCreateApiKey = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: CreateApiKeyDto) => adminApiKeysApi.create(dto),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: adminApiKeysKeys.all });
		},
	});
};

export const useUpdateApiKey = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateApiKeyDto }) =>
			adminApiKeysApi.update(id, dto),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: adminApiKeysKeys.all });
		},
	});
};

export const useDeleteApiKey = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id }: { id: string }) => adminApiKeysApi.remove(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: adminApiKeysKeys.all });
		},
	});
};
