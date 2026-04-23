"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type FC, useMemo } from "react";

interface StatesDictionary {
	dict: Dictionary["adminSuggestionDetail"]["states"];
}

interface LoginRequiredProps extends StatesDictionary {
	lang: Locale;
	id: string;
}

export const LoginRequired: FC<LoginRequiredProps> = ({ dict, lang, id }) => {
	const params = useSearchParams();
	const href = useMemo(() => {
		const qs = params?.toString();
		const redirect =
			`/${lang}/admin/suggestions/${id}` + (qs ? `?${qs}` : "");
		return `/${lang}/auth?redirect=${encodeURIComponent(redirect)}`;
	}, [id, lang, params]);

	return (
		<div className="text-center py-16 px-6 bg-surface border border-edge rounded-xl">
			<h2 className="text-lg font-semibold text-foreground mb-2">
				{dict.loginRequiredTitle}
			</h2>
			<p className="max-w-sm mx-auto mb-6 text-base text-muted">
				{dict.loginRequiredText}
			</p>
			<Button asChild variant="primary" size="md">
				<Link href={href}>{dict.loginRequiredCta}</Link>
			</Button>
		</div>
	);
};

export const Forbidden: FC<StatesDictionary> = ({ dict }) => (
	<div className="text-center py-16 px-6 bg-surface border border-edge rounded-xl">
		<h2 className="text-lg font-semibold text-foreground mb-2">
			{dict.forbiddenTitle}
		</h2>
		<p className="max-w-sm mx-auto text-base text-muted">
			{dict.forbiddenText}
		</p>
	</div>
);

interface NotFoundProps extends StatesDictionary {
	lang: Locale;
}

export const NotFoundState: FC<NotFoundProps> = ({ dict, lang }) => (
	<div className="text-center py-16 px-6 bg-surface border border-edge rounded-xl">
		<h2 className="text-lg font-semibold text-foreground mb-2">
			{dict.notFoundTitle}
		</h2>
		<p className="max-w-sm mx-auto mb-6 text-base text-muted">
			{dict.notFoundText}
		</p>
		<Button asChild variant="secondary" size="md">
			<Link href={`/${lang}/admin/suggestions`}>{dict.backToList}</Link>
		</Button>
	</div>
);

interface ErrorStateProps extends StatesDictionary {
	onRetry: () => void;
}

export const ErrorState: FC<ErrorStateProps> = ({ dict, onRetry }) => (
	<div className="text-center py-16 px-6 bg-surface border border-edge rounded-xl">
		<h2 className="text-lg font-semibold text-foreground mb-2">
			{dict.errorTitle}
		</h2>
		<p className="max-w-sm mx-auto mb-6 text-base text-muted">
			{dict.errorText}
		</p>
		<Button type="button" variant="primary" size="md" onClick={onRetry}>
			{dict.retry}
		</Button>
	</div>
);
