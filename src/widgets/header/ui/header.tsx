"use client";

import { ThemeSwitcher } from "@/features/theme-switcher";
import { Logo } from "@/shared/ui/primitives/logo";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetClose,
} from "@/shared/ui/primitives/sheet";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
	{ href: "/search", label: "Словарь" },
	{ href: "/phraseology", label: "Фразеология" },
	{ href: "/stats", label: "Статистика" },
	{ href: "/about", label: "О проекте" },
];

export function Header() {
	return (
		<nav className="nav">
			<Logo variant="cyrillic" size="nav" />

			<div className="nav-center">
				{NAV_LINKS.map((link) => (
					<Link key={link.href} href={link.href} className="nav-link">
						{link.label}
					</Link>
				))}
			</div>

			<div className="nav-right">
				<ThemeSwitcher />
				<Link href="/login" className="btn btn-primary btn-sm">
					Войти
				</Link>
			</div>

			<Sheet>
				<SheetTrigger asChild>
					<button className="nav-burger" aria-label="Меню">
						<MenuIcon size={22} />
					</button>
				</SheetTrigger>
				<SheetContent side="right" className="flex flex-col gap-0 pt-14 px-6 w-3/4 max-w-xs">
					{NAV_LINKS.map((link) => (
						<SheetClose key={link.href} asChild>
							<Link href={link.href} className="mob-nav-link">
								{link.label}
							</Link>
						</SheetClose>
					))}
					<SheetClose asChild>
						<Link href="/login" className="btn btn-primary btn-sm mt-6 text-center">
							Войти
						</Link>
					</SheetClose>
				</SheetContent>
			</Sheet>
		</nav>
	);
}
