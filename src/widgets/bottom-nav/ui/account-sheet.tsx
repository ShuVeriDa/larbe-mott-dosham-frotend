"use client";

import { useCurrentUser, useUserStats } from "@/entities/user";
import { useLogout } from "@/features/auth";
import {
	LangInline,
	ThemeInline,
	UserAvatar,
	UserDropdownBadge,
	canSeeAdminPanel,
	getPrimaryRole,
	getUserInitials,
} from "@/features/user-menu";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { useAuthStatus, useIsAuthenticated } from "@/shared/lib/auth";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/shared/ui/primitives/sheet";
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
import { usePathname, useRouter } from "next/navigation";
import { type FC, type ReactNode, useState } from "react";
import { toast } from "sonner";

interface AccountSheetProps {
	lang: Locale;
	dict: Dictionary["userMenu"];
	navLoginLabel: string;
}

const ACCOUNT_PATHS = [
	"/profile",
	"/favorites",
	"/history",
	"/suggestions",
	"/settings",
];

const rowBase =
	"flex items-center gap-3 w-full px-4 py-3 text-sm text-subtle hover:text-foreground hover:bg-surface transition-colors duration-150 cursor-pointer";

const SheetRow: FC<{
	href: string;
	icon: ReactNode;
	label: string;
	badge?: ReactNode;
	variant?: "default" | "accent" | "danger";
}> = ({ href, icon, label, badge, variant = "default" }) => (
	<SheetClose asChild>
		<Link
			href={href}
			className={cn(
				rowBase,
				variant === "accent" && "text-primary hover:text-primary",
				variant === "danger" &&
					"text-danger hover:text-danger hover:bg-danger-dim",
			)}
		>
			<span className="w-4 h-4 shrink-0 flex items-center justify-center [&_svg]:w-4 [&_svg]:h-4 text-muted">
				{icon}
			</span>
			<span className="flex-1 leading-tight">{label}</span>
			{badge}
		</Link>
	</SheetClose>
);

const SheetButton: FC<{
	icon: ReactNode;
	label: string;
	variant?: "default" | "danger";
	onClick?: () => void;
	disabled?: boolean;
}> = ({ icon, label, variant = "default", onClick, disabled }) => (
	<SheetClose asChild>
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={cn(
				rowBase,
				"border-none bg-transparent text-left",
				variant === "danger" &&
					"text-danger hover:text-danger hover:bg-danger-dim",
				disabled && "opacity-40 pointer-events-none",
			)}
		>
			<span className="w-4 h-4 shrink-0 flex items-center justify-center [&_svg]:w-4 [&_svg]:h-4 text-muted">
				{icon}
			</span>
			<span className="flex-1 leading-tight">{label}</span>
		</button>
	</SheetClose>
);

const TabButton: FC<{
	isActive: boolean;
	isOpen: boolean;
	avatar: ReactNode;
	label: string;
	onClick?: () => void;
	asChild?: boolean;
}> = ({ isActive, isOpen, avatar, label }) => (
	<span
		className={cn(
			"flex-1 flex flex-col items-center justify-center gap-[3px] px-1",
			"transition-colors duration-150",
			isActive || isOpen ? "text-primary" : "text-muted",
		)}
	>
		<span
			className={cn(
				"flex items-center justify-center w-9 h-6 rounded-full transition-colors duration-150",
				(isActive || isOpen) && "bg-primary-dim",
			)}
		>
			{avatar}
		</span>
		<span className="text-[10px] font-medium leading-none truncate max-w-full px-1">
			{label}
		</span>
	</span>
);

export const AccountSheet: FC<AccountSheetProps> = ({
	lang,
	dict,
	navLoginLabel,
}) => {
	const isAuthenticated = useIsAuthenticated();
	const authStatus = useAuthStatus();
	const { data: user } = useCurrentUser();
	const [open, setOpen] = useState(false);
	const [statsEnabled, setStatsEnabled] = useState(false);
	const { data: stats } = useUserStats({ enabled: statsEnabled });
	const logout = useLogout();
	const router = useRouter();
	const pathname = usePathname();

	const isAccountActive = ACCOUNT_PATHS.some(p =>
		pathname.startsWith(`/${lang}${p}`),
	);

	const handleOpenChange = (next: boolean) => {
		setOpen(next);
		if (next) setStatsEnabled(true);
	};

	const handleLogout = async () => {
		setOpen(false);
		try {
			await logout.mutateAsync();
			router.replace(`/${lang}`);
			router.refresh();
		} catch {
			toast.error(dict.logoutError);
		}
	};

	if (authStatus !== "ready" || !isAuthenticated) {
		return (
			<Link
				href={`/${lang}/auth`}
				className={cn(
					"flex-1 flex flex-col items-center justify-center gap-[3px] px-1",
					"transition-colors duration-150 text-muted hover:text-subtle",
				)}
			>
				<span className="flex items-center justify-center w-9 h-6 rounded-full">
					<UserIcon size={17} />
				</span>
				<span className="text-[10px] font-medium leading-none">
					{navLoginLabel}
				</span>
			</Link>
		);
	}

	const initials = user ? getUserInitials(user.name || user.username) : "?";
	const role = user ? getPrimaryRole(user) : "USER";
	const pendingSuggestions = stats?.suggestionsCount ?? 0;
	const favoritesCount = stats?.favoritesCount ?? 0;

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetTrigger asChild>
				<button
					type="button"
					className="flex-1 flex items-stretch p-0 border-none bg-transparent cursor-pointer"
				>
					<TabButton
						isActive={isAccountActive}
						isOpen={open}
						label={dict.items.profile}
						avatar={
							user ? (
								<UserAvatar
									initials={initials}
									size="sm"
									className="w-[22px] h-[22px] text-[9px]"
								/>
							) : (
								<UserIcon size={17} />
							)
						}
					/>
				</button>
			</SheetTrigger>

			<SheetContent
				side="bottom"
				aria-describedby={undefined}
				className="rounded-t-2xl gap-0 p-0 max-h-[85dvh] overflow-y-auto"
			>
				<SheetTitle className="sr-only">{dict.ariaLabel}</SheetTitle>
				{/* Drag handle */}
				<div className="flex justify-center pt-3 pb-1">
					<div className="w-10 h-1 rounded-full bg-edge" />
				</div>

				{/* User header */}
				{user && (
					<div className="relative flex items-center gap-3 px-4 pt-3 pb-4 border-b border-edge">
						<UserAvatar initials={initials} size="md" />
						<div className="flex-1 min-w-0">
							<div className="text-sm font-semibold text-foreground truncate">
								{user.name || user.username}
							</div>
							<div className="text-xs text-muted truncate">{user.email}</div>
						</div>
					</div>
				)}

				{/* Main links */}
				<div className="py-2">
					<SheetRow
						href={`/${lang}/profile`}
						icon={<UserIcon />}
						label={dict.items.profile}
					/>
					<SheetRow
						href={`/${lang}/favorites`}
						icon={<BookmarkIcon />}
						label={dict.items.favorites}
						badge={
							favoritesCount > 0 ? (
								<UserDropdownBadge>{favoritesCount}</UserDropdownBadge>
							) : undefined
						}
					/>
					<SheetRow
						href={`/${lang}/history`}
						icon={<ClockIcon />}
						label={dict.items.history}
					/>
					<SheetRow
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

				{/* Admin */}
				{canSeeAdminPanel(role) && (
					<div className="py-2 border-t border-edge">
						<div className="px-4 pt-2 pb-1 text-[0.62rem] font-semibold text-faint uppercase tracking-[0.08em]">
							{dict.sections.admin}
						</div>
						<SheetRow
							href={`/${lang}/admin`}
							icon={<LayoutDashboardIcon />}
							label={dict.items.adminPanel}
							variant="accent"
						/>
					</div>
				)}

				{/* Settings + inline toggles */}
				<div className="py-2 border-t border-edge">
					<SheetRow
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

				{/* Logout */}
				<div className="py-2 border-t border-edge">
					<SheetButton
						icon={<LogOutIcon />}
						label={dict.items.logout}
						variant="danger"
						onClick={handleLogout}
						disabled={logout.isPending}
					/>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between px-4 py-3 border-t border-edge bg-glass font-mono text-[0.65rem] text-faint pb-safe">
					<span>{dict.footer.version}</span>
					<SheetClose asChild>
						<Link
							href={`/${lang}/about`}
							className="text-muted hover:text-primary transition-colors"
						>
							{dict.footer.brand}
						</Link>
					</SheetClose>
				</div>
			</SheetContent>
		</Sheet>
	);
};
