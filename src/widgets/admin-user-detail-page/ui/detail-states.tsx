import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import Link from "next/link";
import type { FC } from "react";

interface DetailErrorProps {
	dict: Dictionary["adminUserDetail"]["error"];
	onRetry: () => void;
}

export const DetailError: FC<DetailErrorProps> = ({ dict, onRetry }) => (
	<div className="rounded-lg border border-border bg-surface p-8 text-center">
		<h2 className="text-lg font-semibold text-foreground mb-2">
			{dict.title}
		</h2>
		<p className="text-sm text-muted-foreground mb-4">{dict.text}</p>
		<Button type="button" variant="primary" onClick={onRetry}>
			{dict.retry}
		</Button>
	</div>
);

interface DetailNotFoundProps {
	lang: Locale;
	dict: Dictionary["adminUserDetail"]["notFound"];
}

export const DetailNotFound: FC<DetailNotFoundProps> = ({ lang, dict }) => (
	<div className="rounded-lg border border-border bg-surface p-8 text-center">
		<h2 className="text-lg font-semibold text-foreground mb-2">
			{dict.title}
		</h2>
		<p className="text-sm text-muted-foreground mb-4">{dict.text}</p>
		<Button asChild variant="primary">
			<Link href={`/${lang}/admin/users`}>{dict.backToList}</Link>
		</Button>
	</div>
);

interface DetailLoginRequiredProps {
	lang: Locale;
	dict: Dictionary["adminUserDetail"]["loginRequired"];
}

export const DetailLoginRequired: FC<DetailLoginRequiredProps> = ({
	lang,
	dict,
}) => (
	<div className="rounded-lg border border-border bg-surface p-8 text-center">
		<h2 className="text-lg font-semibold text-foreground mb-2">
			{dict.title}
		</h2>
		<p className="text-sm text-muted-foreground mb-4">{dict.text}</p>
		<Button asChild variant="primary">
			<Link href={`/${lang}/auth`}>{dict.cta}</Link>
		</Button>
	</div>
);

interface DetailForbiddenProps {
	dict: Dictionary["adminUserDetail"]["forbidden"];
}

export const DetailForbidden: FC<DetailForbiddenProps> = ({ dict }) => (
	<div className="rounded-lg border border-border bg-surface p-8 text-center">
		<h2 className="text-lg font-semibold text-foreground mb-2">
			{dict.title}
		</h2>
		<p className="text-sm text-muted-foreground">{dict.text}</p>
	</div>
);
