"use client";

import { ThemeSwitcher } from "@/features/theme-switcher";
import { UserMenu } from "@/features/user-menu";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useIsAuthenticated, useAuthStatus } from "@/shared/lib/auth";
import { Logo } from "@/shared/ui/primitives/logo";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from "@/shared/ui/primitives/sheet";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
	lang: Locale;
	nav: Dictionary["nav"];
	userMenu: Dictionary["userMenu"];
}

export function Header({ lang, nav, userMenu }: HeaderProps) {
	const isAuthenticated = useIsAuthenticated();
	const authStatus = useAuthStatus();

	const NAV_LINKS = [
		{ href: `/${lang}/search`, label: nav.dictionary },
		{ href: `/${lang}/phraseology`, label: nav.phraseology },
		{ href: `/${lang}/random`, label: nav.random },
		{ href: `/${lang}/stats`, label: nav.statistics },
		{ href: `/${lang}/about`, label: nav.about },
	];

	return (
		<header className="sticky top-0 z-100">
			<nav className="px-6 py-3 flex items-center justify-between  backdrop-blur-2xl bg-overlay border-b border-edge">
				<Logo variant="cyrillic" size="nav" locale={lang} />

				<div className="nav-center">
					{NAV_LINKS.map(link => (
						<Link key={link.href} href={link.href} className="nav-link">
							{link.label}
						</Link>
					))}
				</div>

				<div className="nav-right">
					{authStatus === "ready" &&
						(isAuthenticated ? (
							<UserMenu lang={lang} dict={userMenu} />
						) : (
							<>
								<ThemeSwitcher />
								<Link
									href={`/${lang}/auth`}
									className="btn btn-primary btn-sm"
								>
									{nav.login}
								</Link>
							</>
						))}
				</div>

				<Sheet>
					<SheetTrigger asChild>
						<button className="nav-burger" aria-label="Меню">
							<MenuIcon size={22} />
						</button>
					</SheetTrigger>
					<SheetContent
						side="right"
						className="flex flex-col gap-0 pt-14 px-6 w-3/4 max-w-xs"
					>
						{NAV_LINKS.map(link => (
							<SheetClose key={link.href} asChild>
								<Link href={link.href} className="mob-nav-link">
									{link.label}
								</Link>
							</SheetClose>
						))}
						{authStatus === "ready" && !isAuthenticated && (
							<SheetClose asChild>
								<Link
									href={`/${lang}/auth`}
									className="btn btn-primary btn-sm mt-3 text-center"
								>
									{nav.login}
								</Link>
							</SheetClose>
						)}
					</SheetContent>
				</Sheet>
			</nav>
		</header>
	);
}
