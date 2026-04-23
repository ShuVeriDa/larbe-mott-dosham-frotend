import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import Link from "next/link";
import type { FC } from "react";

interface ProfileLoginRequiredProps {
	lang: Locale;
	dict: Dictionary["profile"]["loginRequired"];
}

export const ProfileLoginRequired: FC<ProfileLoginRequiredProps> = ({
	lang,
	dict,
}) => (
	<section className="max-w-[480px] mx-auto px-6 py-20 text-center">
		<h1 className="text-xl font-bold mb-3">{dict.title}</h1>
		<p className="text-sm text-muted mb-6">{dict.text}</p>
		<Button asChild size="md">
			<Link href={`/${lang}/auth?returnUrl=/${lang}/profile`}>{dict.cta}</Link>
		</Button>
	</section>
);
