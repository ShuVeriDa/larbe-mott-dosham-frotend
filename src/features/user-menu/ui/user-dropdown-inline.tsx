"use client";

import type { Locale } from "@/i18n/dictionaries";
import { cn, useHasMounted } from "@/shared/lib";
import { GlobeIcon, MoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import type { FC, ReactNode } from "react";

const LOCALES: Locale[] = ["ru", "che", "en"];

const LOCALE_SHORT: Record<Locale, string> = {
	ru: "RU",
	che: "CHE",
	en: "EN",
};

interface ShellProps {
	icon: ReactNode;
	label: string;
	children: ReactNode;
}

const Shell: FC<ShellProps> = ({ icon, label, children }) => (
	<div className="flex items-center justify-between gap-3 px-4 py-2">
		<div className="flex items-center gap-3 text-sm text-subtle shrink-0">
			<span className="w-5 h-5 flex items-center justify-center text-muted [&_svg]:w-4 [&_svg]:h-4">
				{icon}
			</span>
			{label}
		</div>
		{children}
	</div>
);

const segBtn = (active: boolean) =>
	cn(
		"px-2 py-1 min-w-8 text-xs font-medium rounded-full transition-colors",
		active
			? "bg-primary text-primary-foreground"
			: "text-muted hover:text-foreground",
	);

interface ThemeInlineProps {
	label: string;
	darkLabel: string;
	lightLabel: string;
}

export const ThemeInline: FC<ThemeInlineProps> = ({
	label,
	darkLabel,
	lightLabel,
}) => {
	const { theme, setTheme } = useTheme();
	const mounted = useHasMounted();

	const isActive = (value: "dark" | "light") => mounted && theme === value;

	return (
		<Shell icon={<MoonIcon />} label={label}>
			<div
				role="radiogroup"
				aria-label={label}
				className="flex bg-surface border border-edge rounded-full p-0.5 gap-px"
			>
				<button
					type="button"
					role="radio"
					aria-checked={isActive("dark")}
					aria-label={darkLabel}
					onClick={e => {
						e.preventDefault();
						setTheme("dark");
					}}
					className={segBtn(isActive("dark"))}
				>
					🌙
				</button>
				<button
					type="button"
					role="radio"
					aria-checked={isActive("light")}
					aria-label={lightLabel}
					onClick={e => {
						e.preventDefault();
						setTheme("light");
					}}
					className={segBtn(isActive("light"))}
				>
					☀️
				</button>
			</div>
		</Shell>
	);
};

interface LangInlineProps {
	label: string;
	currentLang: Locale;
}

export const LangInline: FC<LangInlineProps> = ({ label, currentLang }) => {
	const router = useRouter();
	const pathname = usePathname();

	const switchLang = (next: Locale) => {
		if (next === currentLang) return;
		const segments = pathname.split("/");
		segments[1] = next;
		router.push(segments.join("/"));
	};

	return (
		<Shell icon={<GlobeIcon />} label={label}>
			<div
				role="radiogroup"
				aria-label={label}
				className="flex bg-surface border border-edge rounded-full p-0.5 gap-px"
			>
				{LOCALES.map(locale => {
					const active = locale === currentLang;
					return (
						<button
							key={locale}
							type="button"
							role="radio"
							aria-checked={active}
							onClick={e => {
								e.preventDefault();
								switchLang(locale);
							}}
							className={segBtn(active)}
						>
							{LOCALE_SHORT[locale]}
						</button>
					);
				})}
			</div>
		</Shell>
	);
};
