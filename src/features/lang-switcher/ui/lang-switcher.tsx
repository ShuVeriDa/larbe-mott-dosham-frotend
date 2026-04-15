"use client";

import type { Locale } from "@/i18n/dictionaries";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/ui/primitives/dropdown-menu";
import { CheckIcon, GlobeIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface LangSwitcherProps {
	currentLang: Locale;
	labels: Record<Locale, string>;
}

const LOCALES: Locale[] = ["che", "ru", "en"];

export function LangSwitcher({ currentLang, labels }: LangSwitcherProps) {
	const router = useRouter();
	const pathname = usePathname();

	const switchLang = (newLang: Locale) => {
		// pathname is "/{lang}/..." — replace the first segment
		const segments = pathname.split("/");
		segments[1] = newLang;
		router.push(segments.join("/"));
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="lang-switcher-trigger" aria-label="Сменить язык">
					<GlobeIcon size={14} className="text-muted" />
					<span>{currentLang.toUpperCase()}</span>
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" sideOffset={8}>
				{LOCALES.map(locale => (
					<DropdownMenuItem
						key={locale}
						onClick={() => switchLang(locale)}
						className={locale === currentLang ? "text-primary" : ""}
					>
						<span className="lang-code">{locale.toUpperCase()}</span>
						<span>{labels[locale]}</span>
						{locale === currentLang && (
							<CheckIcon size={13} className="ml-auto text-primary" />
						)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
