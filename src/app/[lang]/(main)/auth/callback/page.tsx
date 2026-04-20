import { OAuthCallback } from "@/features/auth";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

	return {
		title: dict.auth.callback.metaTitle,
		robots: { index: false, follow: false },
	};
};

export default async function OAuthCallbackPage({ params }: PageProps) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const dict = await getDictionary(lang);

	return (
		<section className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12">
			<div className="relative z-1 flex w-full max-w-[420px] flex-col">
				<div
					className="w-full rounded-xl border border-edge bg-raised p-8 shadow-[0_8px_40px_rgba(0,0,0,0.15)] max-sm:rounded-lg max-sm:p-6"
					style={{ animation: "cardIn .5s var(--ease-out) both" }}
				>
					<Suspense fallback={null}>
						<OAuthCallback dict={dict.auth.callback} lang={lang} />
					</Suspense>
				</div>
			</div>
		</section>
	);
}
