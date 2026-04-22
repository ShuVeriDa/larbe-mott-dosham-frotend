"use client";

import { isApiError } from "@/shared/api";
import { useEffect } from "react";
import { toast } from "sonner";

type ErrorDict = {
	offline: string;
	rateLimit: string;
	server: string;
	text: string;
};

const pickMessage = (error: unknown, dict: ErrorDict): string => {
	if (!isApiError(error)) return dict.text;
	if (error.statusCode === 0) return dict.offline;
	if (error.statusCode === 429) return dict.rateLimit;
	if (error.statusCode >= 500) return dict.server;
	return dict.text;
};

export const usePhraseologyErrorToast = (
	error: unknown,
	isError: boolean,
	dict: ErrorDict,
) => {
	useEffect(() => {
		if (!isError || !error) return;
		toast.error(pickMessage(error, dict));
	}, [isError, error, dict]);
};
