import { apiClient } from "@/shared/api";
import type {
  DeleteAccountDto,
  UpdatePasswordDto,
  UpdatePreferencesDto,
  UpdateProfileDto,
  User,
  UserStats,
} from "./types";

export const userApi = {
  async getMe(): Promise<User> {
    const { data } = await apiClient.get<User>("/auth/me");
    return data;
  },

  async updateProfile(dto: UpdateProfileDto): Promise<User> {
    const { data } = await apiClient.patch<User>("/users/me", dto);
    return data;
  },

  async updatePassword(dto: UpdatePasswordDto): Promise<{ message: string }> {
    const { data } = await apiClient.patch<{ message: string }>("/users/me/password", dto);
    return data;
  },

  async updatePreferences(dto: UpdatePreferencesDto): Promise<UpdatePreferencesDto> {
    const { data } = await apiClient.patch<UpdatePreferencesDto>("/users/me/preferences", dto);
    return data;
  },

  async getStats(): Promise<UserStats> {
    const { data } = await apiClient.get<UserStats>("/users/me/stats");
    return data;
  },

  async deleteAccount(dto: DeleteAccountDto): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>("/users/me", { data: dto });
    return data;
  },

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const form = new FormData();
    form.append("file", file);
    const { data } = await apiClient.post<{ avatarUrl: string }>(
      "/users/me/avatar",
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },
};
