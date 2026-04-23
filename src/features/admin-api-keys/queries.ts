import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { adminApiKeysApi } from "./api";
import type {
	ApiKeyListQuery,
	CreateApiKeyDto,
	UpdateApiKeyDto,
} from "./types";

export const adminApiKeysKeys = {
	all: ["admin", "api-keys"] as const,
	stats: () => [...adminApiKeysKeys.all, "stats"] as const,
	list: (query: ApiKeyListQuery) =>
		[...adminApiKeysKeys.all, "list", query] as const,
};

interface Options {
	enabled?: boolean;
}

export const useAdminApiKeys = (
	query: ApiKeyListQuery,
	options: Options = {},
) =>
	useQuery({
		queryKey: adminApiKeysKeys.list(query),
		queryFn: () => adminApiKeysApi.getList(query),
		enabled: options.enabled ?? true,
		placeholderData: keepPreviousData,
		staleTime: 30 * 1000,
	});

export const useAdminApiKeysStats = (options: Options = {}) =>
	useQuery({
		queryKey: adminApiKeysKeys.stats(),
		queryFn: adminApiKeysApi.getStats,
		enabled: options.enabled ?? true,
		staleTime: 60 * 1000,
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

export const useRevokeApiKey = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id }: { id: string }) => adminApiKeysApi.revoke(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: adminApiKeysKeys.all });
		},
	});
};
