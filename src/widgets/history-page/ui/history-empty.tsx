"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import Link from "next/link";
import type { FC } from "react";

interface HistoryEmptyProps {
	dict: Dictionary["history"]["empty"];
	lang: Locale;
}

export const HistoryEmpty: FC<HistoryEmptyProps> = ({ dict, lang }) => (
	<div className="text-center py-16 px-6">
		<div className="text-5xl mb-4 opacity-40" aria-hidden>
			{dict.icon}
		</div>
		<h2 className="text-lg font-semibold text-foreground mb-2">
			{dict.title}
		</h2>
		<p className="max-w-sm mx-auto mb-6 text-base text-muted">{dict.text}</p>
		<Button asChild variant="primary" size="md">
			<Link href={`/${lang}/search`}>{dict.cta}</Link>
		</Button>
	</div>
);
