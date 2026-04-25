"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useAuthStatus, useIsAuthenticated } from "@/shared/lib/auth";
import { Button, Typography } from "@/shared/ui";
import Link from "next/link";
import { FC } from "react";

interface IAboutCtaProps {
	cta: Dictionary["about"]["cta"];
	lang: Locale;
}

export const AboutCta: FC<IAboutCtaProps> = ({ cta, lang }) => {
	const authStatus = useAuthStatus();
	const isAuthenticated = useIsAuthenticated();
	const showAuthed = authStatus === "ready" && isAuthenticated;

	return (
		<aside className="relative text-center overflow-hidden py-12 px-6 bg-surface border border-edge rounded-xl mt-12">
			<span
				aria-hidden="true"
				className="absolute inset-x-0 top-0 h-0.5"
				style={{
					background:
						"linear-gradient(90deg, transparent, var(--color-primary, var(--accent)), transparent)",
				}}
			/>
			<Typography
				tag="h2"
				className="text-xl font-bold text-foreground mb-2"
			>
				{cta.title}
			</Typography>
			<Typography tag="p" className="text-base text-muted mb-6">
				{cta.text}
			</Typography>
			<div className="flex gap-3 justify-center flex-wrap">
				<Button asChild variant="primary" size="md">
					<Link href={`/${lang}/search`}>{cta.openDictionary}</Link>
				</Button>
				{showAuthed ? (
					<Button asChild variant="outline" size="md">
						<Link href={`/${lang}/profile`}>{cta.profile}</Link>
					</Button>
				) : (
					<Button asChild variant="outline" size="md">
						<Link href={`/${lang}/auth`}>{cta.register}</Link>
					</Button>
				)}
			</div>
		</aside>
	);
};
