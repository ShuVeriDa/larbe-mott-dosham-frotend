import type { Dictionary } from "@/i18n/dictionaries";
import Link from "next/link";
import type { FC } from "react";

interface EntryNotFoundProps {
	lang: string;
	dict: Dictionary["entry"]["notFound"];
}

export const EntryNotFound: FC<EntryNotFoundProps> = ({ lang, dict }) => (
	<div className="py-20 text-center">
		<h1 className="text-2xl font-bold text-foreground mb-3">{dict.title}</h1>
		<p className="text-sm text-muted max-w-md mx-auto mb-6">{dict.text}</p>
		<Link
			href={`/${lang}/search`}
			className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:brightness-105 transition"
		>
			{dict.backToSearch}
		</Link>
	</div>
);
