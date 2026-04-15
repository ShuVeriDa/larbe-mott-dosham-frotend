import { TooltipProvider } from "@/shared/ui/primitives/tooltip";
import { cn } from "@/shared/lib";
import { QueryProvider } from "@/shared/ui/query-provider";
import { ThemeProvider } from "@/shared/ui/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://dosham.app"),
	title: {
		template: "%s | Мотт Ларбе Дошам",
		default: "Мотт Ларбе Дошам — Единый словарь чеченского языка",
	},
	description:
		"Мотт Ларбе Дошам — единый цифровой словарь чеченского языка. Поиск слов, морфология, склонение, спряжение и API из 14 основных источников. Чеченско-русский и русско-чеченский словарь.",
	keywords: ["чеченский язык", "словарь", "нохчийн мотт", "чеченско-русский словарь", "Мотт Ларбе"],
	authors: [{ name: "Мотт Ларбе" }],
	creator: "Мотт Ларбе",
	openGraph: {
		siteName: "Мотт Ларбе Дошам",
		locale: "ru_RU",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = (await headers()).get("x-locale") ?? "ru";

	return (
		<html
			lang={locale}
			suppressHydrationWarning
			className={cn(
				"h-full",
				"antialiased",
				geistSans.variable,
				geistMono.variable,
				"font-sans",
				outfit.variable,
			)}
		>
			<body className="min-h-full flex flex-col" suppressHydrationWarning>
				<ThemeProvider>
					<QueryProvider>
						<TooltipProvider>{children}</TooltipProvider>
					</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
