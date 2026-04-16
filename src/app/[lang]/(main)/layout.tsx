import { Header } from "@/widgets/header";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
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
      <header>
        <Header lang={lang} nav={dict.nav} />
      </header>
      <main className="flex-1">{children}</main>
      <footer />
    </>
  );
}
