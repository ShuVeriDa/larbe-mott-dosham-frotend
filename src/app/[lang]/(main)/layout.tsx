import { PreferencesSync } from "@/features/preferences-sync";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import { BottomNav } from "@/widgets/bottom-nav";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import { notFound } from "next/navigation";

export default async function MainLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const dict = await getDictionary(lang);

	return (
		<>
			<PreferencesSync lang={lang} />
			<Header lang={lang} nav={dict.nav} userMenu={dict.userMenu} />

			<main className="flex-1 pb-16 sm:pb-0">{children}</main>
			<footer className="pb-16 sm:pb-0">
				<Footer lang={lang} footer={dict.footer} />
			</footer>

			<BottomNav lang={lang} nav={dict.nav} userMenu={dict.userMenu} />
		</>
	);
}
