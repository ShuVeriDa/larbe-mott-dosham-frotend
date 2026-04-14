import type { ApiErrorResponse } from "@/shared/types";
import { AxiosError } from "axios";

export class ApiError extends Error {
  readonly statusCode: number;
  readonly messages: string[];
  readonly correlationId?: string;

  constructor(response: ApiErrorResponse) {
    const msg = Array.isArray(response.message)
      ? response.message.join("; ")
      : response.message;
    super(msg);
    this.name = "ApiError";
    this.statusCode = response.statusCode;
    this.messages = Array.isArray(response.message)
      ? response.message
      : [response.message];
    this.correlationId = response.correlationId;
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

export function toApiError(err: unknown): ApiError {
  if (isApiError(err)) return err;

  if (err instanceof AxiosError && err.response?.data) {
    const data = err.response.data as ApiErrorResponse;
    return new ApiError({
      statusCode: data.statusCode ?? err.response.status,
      message: data.message ?? err.message,
      error: data.error,
      correlationId: data.correlationId,
    });
  }

  return new ApiError({
    statusCode: 0,
    message: err instanceof Error ? err.message : "Unknown error",
  });
}
