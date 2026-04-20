"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { isApiError } from "@/shared/api";
import { useRouter, useSearchParams } from "next/navigation";
import { type FC, useEffect, useRef, useState } from "react";
import { useOAuthExchange } from "../queries";

interface OAuthCallbackProps {
	dict: Dictionary["auth"]["callback"];
	lang: Locale;
}

const isSafeRedirect = (value: string | null): value is string =>
	!!value && value.startsWith("/") && !value.startsWith("//");

const pickError = (
	error: unknown,
	dict: Dictionary["auth"]["callback"],
): string => {
	if (!isApiError(error)) return dict.generic;
	if (error.statusCode === 0) return dict.offline;
	if (error.statusCode === 401) return dict.invalidCode;
	if (error.statusCode === 429) return dict.rateLimit;
	if (error.statusCode >= 500) return dict.server;
	return error.messages[0] ?? dict.generic;
};

export const OAuthCallback: FC<OAuthCallbackProps> = ({ dict, lang }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { mutate } = useOAuthExchange();
	const exchanged = useRef(false);

	const [error, setError] = useState<string | null>(null);

	const code = searchParams.get("code");
	const returnToParam = searchParams.get("returnTo");
	const returnTo = isSafeRedirect(returnToParam) ? returnToParam : `/${lang}`;

	useEffect(() => {
		if (exchanged.current) return;
		exchanged.current = true;

		if (!code) {
			setError(dict.missingCode);
			return;
		}

		mutate(
			{ code },
			{
				onSuccess: () => {
					router.replace(returnTo);
					router.refresh();
				},
				onError: err => {
					setError(pickError(err, dict));
				},
			},
		);
	}, [code, dict, mutate, returnTo, router]);

	return (
		<div
			className="flex flex-col items-center gap-4 py-8 text-center"
			role="status"
			aria-live="polite"
		>
			{!error ? (
				<>
					<span
						aria-hidden="true"
						className="size-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary"
					/>
					<p className="text-sm text-subtle">{dict.loading}</p>
				</>
			) : (
				<>
					<h3 className="text-lg font-semibold text-foreground">
						{dict.errorTitle}
					</h3>
					<p className="max-w-[320px] text-sm text-muted">{error}</p>
					<button
						type="button"
						onClick={() => router.replace(`/${lang}/auth`)}
						className="mt-2 text-sm font-medium text-primary hover:underline"
					>
						{dict.backToAuth}
					</button>
				</>
			)}
		</div>
	);
};
