"use client";

import { useCurrentUser } from "@/entities/user";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useAuthStatus, useIsAuthenticated } from "@/shared/lib/auth";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { type FC, useState } from "react";
import { DataSection } from "./data-section";
import { DictionarySection } from "./dictionary-section";
import { GeneralSection } from "./general-section";
import { NotificationsSection } from "./notifications-section";
import { PrivacySection } from "./privacy-section";
import { SettingsLoginRequired } from "./settings-login-required";
import { SettingsNav, type SettingsSectionKey } from "./settings-nav";
import { SettingsSkeleton } from "./settings-skeleton";

interface SettingsPageProps {
	lang: Locale;
	dict: Dictionary["settings"];
	deleteDict: Dictionary["profile"]["delete"];
}

export const SettingsPage: FC<SettingsPageProps> = ({
	lang,
	dict,
	deleteDict,
}) => {
	const authStatus = useAuthStatus();
	const isAuthenticated = useIsAuthenticated();
	const { data: user, isLoading } = useCurrentUser();
	const [active, setActive] = useState<SettingsSectionKey>("general");

	if (authStatus !== "ready" || isLoading) return <SettingsSkeleton />;
	if (!isAuthenticated || !user) {
		return <SettingsLoginRequired lang={lang} dict={dict.loginRequired} />;
	}

	const navItems = [
		{ key: "general" as const, icon: "⚙", label: dict.nav.general },
		{ key: "dictionary" as const, icon: "📖", label: dict.nav.dictionary },
		{
			key: "notifications" as const,
			icon: "🔔",
			label: dict.nav.notifications,
		},
		{ key: "privacy" as const, icon: "🔒", label: dict.nav.privacy },
		{ key: "data" as const, icon: "📦", label: dict.nav.data },
	];

	return (
		<article className="max-w-[720px] mx-auto px-6 py-8 pb-16 max-sm:px-4 max-sm:py-5">
			<Link
				href={`/${lang}/profile`}
				className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-5"
			>
				<ArrowLeftIcon className="size-3.5" />
				<span>{dict.backToProfile}</span>
			</Link>

			<header className="mb-8">
				<h1 className="text-2xl font-bold tracking-tight">
					{dict.header.title}
				</h1>
				<p className="text-sm text-muted-foreground mt-1">
					{dict.header.subtitle}
				</p>
			</header>

			<div className="flex gap-8 max-md:flex-col max-md:gap-0">
				<SettingsNav items={navItems} active={active} onChange={setActive} />

				<section className="flex-1 min-w-0">
					{active === "general" && (
						<GeneralSection
							user={user}
							lang={lang}
							dict={dict.general}
							toasts={dict.toasts}
						/>
					)}
					{active === "dictionary" && (
						<DictionarySection
							user={user}
							dict={dict.dictionary}
							toasts={dict.toasts}
						/>
					)}
					{active === "notifications" && (
						<NotificationsSection dict={dict.notifications} />
					)}
					{active === "privacy" && (
						<PrivacySection
							user={user}
							dict={dict.privacy}
							toasts={dict.toasts}
						/>
					)}
					{active === "data" && (
						<DataSection
							lang={lang}
							dict={dict.data}
							clearDataDict={dict.clearDataDialog}
							deleteDict={deleteDict}
							toasts={dict.toasts}
						/>
					)}
				</section>
			</div>
		</article>
	);
};
