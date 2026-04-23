"use client";

import { useCurrentUser } from "@/entities/user";
import { getPrimaryRole, getUserInitials } from "@/features/user-menu/lib/user-helpers";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useAuthStatus, useIsAuthenticated } from "@/shared/lib/auth";
import { type FC, useState } from "react";
import { PersonalTab } from "./personal-tab";
import { ProfileHeader } from "./profile-header";
import { ProfileLoginRequired } from "./profile-login-required";
import { ProfileSkeleton } from "./profile-skeleton";
import { ProfileStats } from "./profile-stats";
import { ProfileTabPanel, ProfileTabs, type ProfileTabKey } from "./profile-tabs";
import { SecurityTab } from "./security-tab";
import { SessionsTab } from "./sessions-tab";
import { SettingsTab } from "./settings-tab";

interface ProfilePageProps {
	lang: Locale;
	dict: Dictionary["profile"];
}

export const ProfilePage: FC<ProfilePageProps> = ({ lang, dict }) => {
	const authStatus = useAuthStatus();
	const isAuthenticated = useIsAuthenticated();
	const { data: user, isLoading } = useCurrentUser();
	const [activeTab, setActiveTab] = useState<ProfileTabKey>("personal");

	if (authStatus !== "ready" || isLoading) return <ProfileSkeleton />;
	if (!isAuthenticated || !user) {
		return <ProfileLoginRequired lang={lang} dict={dict.loginRequired} />;
	}

	const initials = getUserInitials(user.name || user.username);
	const role = getPrimaryRole(user);
	const roleLabel = dict.header.role[role] ?? role;

	const tabs = [
		{ key: "personal" as const, label: dict.tabs.personal },
		{ key: "security" as const, label: dict.tabs.security },
		{ key: "settings" as const, label: dict.tabs.settings },
		{ key: "sessions" as const, label: dict.tabs.sessions },
	];

	return (
		<article className="max-w-[720px] mx-auto px-6 py-8 pb-16 max-sm:px-4 max-sm:py-5">
			<ProfileHeader
				user={user}
				initials={initials}
				roleLabel={roleLabel}
				lang={lang}
				dict={dict.header}
			/>

			<ProfileStats dict={dict.stats} />

			<ProfileTabs active={activeTab} onChange={setActiveTab} tabs={tabs}>
				<ProfileTabPanel tab="personal" active={activeTab}>
					<PersonalTab user={user} dict={dict.personal} />
				</ProfileTabPanel>
				<ProfileTabPanel tab="security" active={activeTab}>
					<SecurityTab dict={dict.security} />
				</ProfileTabPanel>
				<ProfileTabPanel tab="settings" active={activeTab}>
					<SettingsTab
						user={user}
						lang={lang}
						dict={dict.settings}
						deleteDict={dict.delete}
					/>
				</ProfileTabPanel>
				<ProfileTabPanel tab="sessions" active={activeTab}>
					<SessionsTab lang={lang} dict={dict.sessions} />
				</ProfileTabPanel>
			</ProfileTabs>
		</article>
	);
};
