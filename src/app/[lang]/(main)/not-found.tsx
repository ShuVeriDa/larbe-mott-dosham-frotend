import { headers } from "next/headers";
import Link from "next/link";

export const metadata = {
	title: "404",
	robots: { index: false, follow: false },
};

const CONTENT = {
	ru: {
		title: "Страница не найдена",
		text: "Такой страницы не существует или она была перемещена.",
		cta: "К словарю",
	},
	en: {
		title: "Page not found",
		text: "This page doesn't exist or has been moved.",
		cta: "Go to dictionary",
	},
} as const;

export default async function NotFound() {
	const locale = (await headers()).get("x-locale") ?? "ru";
	const c = locale === "en" ? CONTENT.en : CONTENT.ru;
	const lang = ["ru", "en", "che"].includes(locale) ? locale : "ru";

	return (
		<div className="py-20 text-center max-w-[860px] w-full mx-auto px-6">
			<p className="text-5xl font-bold text-primary mb-4">404</p>
			<h1 className="text-2xl font-bold text-foreground mb-3">{c.title}</h1>
			<p className="text-sm text-muted max-w-md mx-auto mb-6">{c.text}</p>
			<Link
				href={`/${lang}/search`}
				className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:brightness-105 transition"
			>
				{c.cta}
			</Link>
		</div>
	);
}
