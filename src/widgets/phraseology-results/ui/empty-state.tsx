"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { FC } from "react";

type EmptyDict = Dictionary["phraseology"]["empty"];

interface EmptyStateProps {
	query: string;
	lang: string;
	dict: EmptyDict;
}

export const EmptyState: FC<EmptyStateProps> = ({ query, lang, dict }) => {
	const router = useRouter();
	const params = useParams<{ lang: string }>();

	const handleNewSearch = () => {
		router.push(`/${params.lang}/phraseology`);
	};

	return (
		<div className="text-center py-16">
			<div className="text-[3rem] mb-4 opacity-30" aria-hidden>
				{dict.icon}
			</div>
			<p className="text-lg font-semibold text-foreground mb-2">
				{dict.title}
			</p>
			<p className="text-sm text-muted max-w-[360px] mx-auto mb-5">
				{dict.text.replace("{q}", query)}{" "}
				<Link
					href={`/${lang}/search`}
					className="text-primary border-b border-primary/30 hover:border-primary"
				>
					{dict.dictionaryLink}
				</Link>
				.
			</p>
			<button
				type="button"
				onClick={handleNewSearch}
				className="inline-flex items-center justify-center gap-2 h-9 px-5 text-sm font-semibold bg-primary text-primary-foreground border-none rounded-md cursor-pointer hover:brightness-105 transition"
			>
				{dict.newSearch}
			</button>
		</div>
	);
};
