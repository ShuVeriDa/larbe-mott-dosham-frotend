import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { userApi } from "./api";
import type {
  DeleteAccountDto,
  UpdatePasswordDto,
  UpdatePreferencesDto,
  UpdateProfileDto,
} from "./types";

export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
  stats: () => [...userKeys.all, "stats"] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: userApi.getMe,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: userApi.getStats,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => userApi.updateProfile(dto),
    onSuccess: (data) => {
      qc.setQueryData(userKeys.me(), data);
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (dto: UpdatePasswordDto) => userApi.updatePassword(dto),
  });
}

export function useUpdatePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdatePreferencesDto) => userApi.updatePreferences(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (dto: DeleteAccountDto) => userApi.deleteAccount(dto),
  });
}
