import { DictionaryDataProvider } from "@/entities/dictionary";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
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
			<DictionaryDataProvider />
			<Header lang={lang} nav={dict.nav} />

			<main className="flex-1">{children}</main>
			<footer>
				<Footer footer={dict.footer} />
			</footer>
		</>
	);
}
