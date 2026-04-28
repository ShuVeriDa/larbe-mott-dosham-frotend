import { AuthCard } from "@/features/auth";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import { Typography } from "@/shared/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/shared/config";
import { Suspense } from "react";

type PageProps = {
	params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const { lang } = await params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const title = dict.auth.meta.loginTitle;
	const description = dict.auth.meta.description;
	const canonicalPath = `/${lang}/auth`;

	return {
		title,
		description,
		alternates: {
			canonical: canonicalPath,
			languages: {
				ru: "/ru/auth",
				en: "/en/auth",
				"ce-RU": "/che/auth",
				"x-default": "/ru/auth",
			},
		},
		openGraph: {
			title,
			description,
			url: `${SITE_URL}${canonicalPath}`,
			type: "website",
		},
		twitter: {
			card: "summary",
			title,
			description,
		},
		robots: { index: false, follow: false },
	};
};

export default async function AuthPage({ params }: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const dict = await getDictionary(lang);

	return (
		<section className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 max-sm:py-5">
			<div
				aria-hidden
				className="pointer-events-none absolute -top-[120px] -right-[100px] h-[500px] w-[500px] rounded-full opacity-50"
				style={{
					background:
						"radial-gradient(circle, var(--accent-glow), transparent 70%)",
				}}
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute -bottom-[80px] -left-[60px] h-[300px] w-[300px] rounded-full opacity-30"
				style={{
					background:
						"radial-gradient(circle, var(--accent-glow), transparent 70%)",
				}}
			/>

			<div className="relative z-1 flex w-full max-w-[420px] flex-col">
				<header className="mb-8 flex flex-col items-center text-center">
					<Typography
						tag="h1"
						className="flex flex-col items-center leading-[0.9]"
					>
						<span className="text-[11px] font-medium tracking-[0.28em] text-primary/80 uppercase">
							Мотт Ларбе
						</span>
						<span className="text-3xl font-extrabold tracking-tight max-sm:text-2xl">
							Дошам
						</span>
					</Typography>
					<Typography tag="p" size="sm" className="mt-3 font-light text-muted">
						{dict.auth.brand.subtitle}
					</Typography>
				</header>

				<Suspense fallback={null}>
					<AuthCard dict={dict.auth} lang={lang} />
				</Suspense>
			</div>
		</section>
	);
}
