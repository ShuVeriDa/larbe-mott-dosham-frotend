"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	BarChart2Icon,
	BookOpenIcon,
	InfoIcon,
	SearchIcon,
	ShuffleIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC } from "react";
import { AccountSheet } from "./account-sheet";

interface BottomNavProps {
	lang: Locale;
	nav: Dictionary["nav"];
	userMenu: Dictionary["userMenu"];
}

export const BottomNav: FC<BottomNavProps> = ({ lang, nav, userMenu }) => {
	const pathname = usePathname();

	const items = [
		{ href: `/${lang}/search`, icon: SearchIcon, label: nav.dictionary },
		{ href: `/${lang}/phraseology`, icon: BookOpenIcon, label: nav.phraseology },
		{ href: `/${lang}/random`, icon: ShuffleIcon, label: nav.random },
		{ href: `/${lang}/stats`, icon: BarChart2Icon, label: nav.statistics },
		{ href: `/${lang}/about`, icon: InfoIcon, label: nav.about },
	];

	return (
		<nav
			aria-label="Основная навигация"
			className="sm:hidden fixed bottom-0 inset-x-0 z-50 flex items-stretch h-16 bg-overlay border-t border-edge backdrop-blur-2xl pb-safe"
		>
			{items.map(({ href, icon: Icon, label }) => {
				const isActive = pathname.startsWith(href);
				return (
					<Link
						key={href}
						href={href}
						aria-current={isActive ? "page" : undefined}
						className={cn(
							"flex-1 flex flex-col items-center justify-center gap-[3px] px-1",
							"transition-colors duration-150",
							isActive ? "text-primary" : "text-muted hover:text-subtle",
						)}
					>
						<span
							className={cn(
								"flex items-center justify-center w-9 h-6 rounded-full transition-colors duration-150",
								isActive && "bg-primary-dim",
							)}
						>
							<Icon size={17} />
						</span>
						<span className="text-[10px] font-medium leading-none truncate max-w-full px-1">
							{label}
						</span>
					</Link>
				);
			})}

			<AccountSheet lang={lang} dict={userMenu} navLoginLabel={nav.login} />
		</nav>
	);
};
