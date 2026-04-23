import { PreferencesSync } from "@/features/preferences-sync";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import { AdminShell } from "@/widgets/admin-shell";
import { notFound } from "next/navigation";

export default async function AdminLayout({
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
			<AdminShell
				lang={lang}
				dict={dict.admin.shell}
				userMenu={dict.userMenu}
			>
				{children}
			</AdminShell>
		</>
	);
}
