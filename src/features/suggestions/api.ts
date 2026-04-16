import { apiClient } from "@/shared/api";
import type {
  AdjacentSuggestions,
  CreateSuggestionDto,
  GetMySuggestionsParams,
  GetSuggestionsParams,
  ReviewSuggestionDto,
  Suggestion,
  SuggestionStats,
  SuggestionsListResponse,
} from "./types";

export const suggestionsApi = {
  async create(dto: CreateSuggestionDto): Promise<Suggestion> {
    const { data } = await apiClient.post<Suggestion>("/suggestions", dto);
    return data;
  },

  async getMine(
    params?: GetMySuggestionsParams,
  ): Promise<SuggestionsListResponse> {
    const { data } = await apiClient.get<SuggestionsListResponse>(
      "/suggestions/my",
      { params },
    );
    return data;
  },

  // Admin/Editor endpoints
  async getStats(): Promise<SuggestionStats> {
    const { data } = await apiClient.get<SuggestionStats>("/suggestions/stats");
    return data;
  },

  async getAll(
    params?: GetSuggestionsParams,
  ): Promise<SuggestionsListResponse> {
    const { data } = await apiClient.get<SuggestionsListResponse>(
      "/suggestions",
      { params },
    );
    return data;
  },

  async getById(id: string): Promise<Suggestion> {
    const { data } = await apiClient.get<Suggestion>(`/suggestions/${id}`);
    return data;
  },

  async getAdjacent(id: string, status?: string): Promise<AdjacentSuggestions> {
    const { data } = await apiClient.get<AdjacentSuggestions>(
      `/suggestions/${id}/adjacent`,
      { params: { status } },
    );
    return data;
  },

  async review(id: string, dto: ReviewSuggestionDto): Promise<Suggestion> {
    const { data } = await apiClient.post<Suggestion>(
      `/suggestions/${id}/review`,
      dto,
    );
    return data;
  },
};
