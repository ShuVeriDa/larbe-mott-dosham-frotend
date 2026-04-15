"use client";

import { LangSwitcher } from "@/features/lang-switcher";
import { ThemeSwitcher } from "@/features/theme-switcher";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
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
}

export function Header({ lang, nav }: HeaderProps) {
	const NAV_LINKS = [
		{ href: `/${lang}/search`, label: nav.dictionary },
		{ href: `/${lang}/phraseology`, label: nav.phraseology },
		{ href: `/${lang}/stats`, label: nav.statistics },
		{ href: `/${lang}/about`, label: nav.about },
	];

	const langLabels = {
		che: "Нохчийн",
		ru: "Русский",
		en: "English",
	} as const;

	return (
		<nav className="nav">
			<Logo variant="cyrillic" size="nav" locale={lang} />

			<div className="nav-center">
				{NAV_LINKS.map(link => (
					<Link key={link.href} href={link.href} className="nav-link">
						{link.label}
					</Link>
				))}
			</div>

			<div className="nav-right">
				<LangSwitcher currentLang={lang} labels={langLabels} />
				<ThemeSwitcher />
				<Link href={`/${lang}/login`} className="btn btn-primary btn-sm">
					{nav.login}
				</Link>
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
					<div className="mt-6 flex items-center gap-3">
						<LangSwitcher currentLang={lang} labels={langLabels} />
					</div>
					<SheetClose asChild>
						<Link
							href={`/${lang}/login`}
							className="btn btn-primary btn-sm mt-3 text-center"
						>
							{nav.login}
						</Link>
					</SheetClose>
				</SheetContent>
			</Sheet>
		</nav>
	);
}
