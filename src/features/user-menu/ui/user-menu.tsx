"use client";

import { useCurrentUser, useUserStats } from "@/entities/user";
import { useLogout } from "@/features/auth";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	BookmarkIcon,
	ClockIcon,
	LayoutDashboardIcon,
	LogOutIcon,
	MessageSquareIcon,
	SettingsIcon,
	UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { canSeeAdminPanel, getPrimaryRole, getUserInitials } from "../lib/user-helpers";
import { UserButton } from "./user-button";
import { UserDropdownHeader } from "./user-dropdown-header";
import { LangInline, ThemeInline } from "./user-dropdown-inline";
import {
	UserDropdownBadge,
	UserDropdownButton,
	UserDropdownLink,
} from "./user-dropdown-item";

interface UserMenuProps {
	lang: Locale;
	dict: Dictionary["userMenu"];
}

export const UserMenu: FC<UserMenuProps> = ({ lang, dict }) => {
	const { data: user, isLoading } = useCurrentUser();
	const [open, setOpen] = useState(false);
	const [statsEnabled, setStatsEnabled] = useState(false);
	const { data: stats } = useUserStats({ enabled: statsEnabled });
	const logout = useLogout();
	const router = useRouter();

	if (isLoading || !user) return null;

	const initials = getUserInitials(user.name || user.username);
	const role = getPrimaryRole(user);
	const pendingSuggestions = stats?.suggestionsCount ?? 0;
	const favoritesCount = stats?.favoritesCount ?? 0;
	const hasNotification = pendingSuggestions > 0;

	const handleOpenChange = (next: boolean) => {
		setOpen(next);
		if (next) setStatsEnabled(true);
	};

	const handleLogout = async () => {
		try {
			await logout.mutateAsync();
			router.replace(`/${lang}`);
			router.refresh();
		} catch {
			toast.error(dict.logoutError);
		}
	};

	return (
		<DropdownMenuPrimitive.Root open={open} onOpenChange={handleOpenChange}>
			<DropdownMenuPrimitive.Trigger asChild>
				<UserButton
					initials={initials}
					displayName={user.name || user.username}
					role={role}
					hasNotification={hasNotification}
					ariaLabel={dict.ariaLabel}
					roleDotTitle={dict.roleDotTitle.replace("{role}", role)}
				/>
			</DropdownMenuPrimitive.Trigger>

			<DropdownMenuPrimitive.Portal>
				<DropdownMenuPrimitive.Content
					align="end"
					sideOffset={10}
					className={cn(
						"w-80 max-w-[calc(100vw-2rem)] rounded-lg overflow-hidden",
						"bg-raised border border-edge shadow-lg backdrop-blur-md",
						"z-50 origin-[var(--radix-dropdown-menu-content-transform-origin)]",
						"data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
						"data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
						"duration-150",
					)}
				>
					<UserDropdownHeader
						initials={initials}
						name={user.name || user.username}
						email={user.email}
						role={role}
					/>

					<div className="py-2">
						<UserDropdownLink
							href={`/${lang}/profile`}
							icon={<UserIcon />}
							label={dict.items.profile}
						/>
						<UserDropdownLink
							href={`/${lang}/favorites`}
							icon={<BookmarkIcon />}
							label={dict.items.favorites}
							badge={
								favoritesCount > 0 ? (
									<UserDropdownBadge>{favoritesCount}</UserDropdownBadge>
								) : undefined
							}
						/>
						<UserDropdownLink
							href={`/${lang}/history`}
							icon={<ClockIcon />}
							label={dict.items.history}
						/>
						<UserDropdownLink
							href={`/${lang}/suggestions`}
							icon={<MessageSquareIcon />}
							label={dict.items.suggestions}
							badge={
								pendingSuggestions > 0 ? (
									<UserDropdownBadge variant="pending">
										{pendingSuggestions}
									</UserDropdownBadge>
								) : undefined
							}
						/>
					</div>

					{canSeeAdminPanel(role) && (
						<div className="py-2 border-t border-edge">
							<div className="px-4 pt-2 pb-1 text-[0.62rem] font-semibold text-faint uppercase tracking-[0.08em]">
								{dict.sections.admin}
							</div>
							<UserDropdownLink
								href={`/${lang}/admin`}
								icon={<LayoutDashboardIcon />}
								label={dict.items.adminPanel}
								variant="accent"
							/>
						</div>
					)}

					<div className="py-2 border-t border-edge">
						<UserDropdownLink
							href={`/${lang}/settings`}
							icon={<SettingsIcon />}
							label={dict.items.settings}
						/>
						<ThemeInline
							label={dict.inline.theme}
							darkLabel={dict.inline.themeDark}
							lightLabel={dict.inline.themeLight}
						/>
						<LangInline label={dict.inline.language} currentLang={lang} />
					</div>

					<div className="py-2 border-t border-edge">
						<UserDropdownButton
							icon={<LogOutIcon />}
							label={dict.items.logout}
							variant="danger"
							onClick={handleLogout}
							disabled={logout.isPending}
						/>
					</div>

					<div className="flex items-center justify-between px-4 py-2 border-t border-edge bg-glass font-mono text-[0.65rem] text-faint">
						<span>{dict.footer.version}</span>
						<Link
							href={`/${lang}/about`}
							className="text-muted hover:text-primary transition-colors"
						>
							{dict.footer.brand}
						</Link>
					</div>
				</DropdownMenuPrimitive.Content>
			</DropdownMenuPrimitive.Portal>
		</DropdownMenuPrimitive.Root>
	);
};
