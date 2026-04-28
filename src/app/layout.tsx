import { TooltipProvider } from "@/shared/ui/primitives/tooltip";
import { Toaster } from "@/shared/ui/primitives/sonner";
import { cn } from "@/shared/lib";
import { AuthBootstrap } from "@/shared/lib/auth";
import { QueryProvider } from "@/shared/ui/query-provider";
import { ThemeProvider } from "@/shared/ui/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { JetBrains_Mono, PT_Sans, PT_Serif } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const ptSans = PT_Sans({
	weight: ["400", "700"],
	subsets: ["latin", "cyrillic"],
	variable: "--font-sans",
});

const ptSerif = PT_Serif({
	weight: ["400", "700"],
	subsets: ["latin", "cyrillic"],
	variable: "--font-serif",
});

const jetBrainsMono = JetBrains_Mono({
	subsets: ["latin", "cyrillic"],
	variable: "--font-mono",
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
				ptSans.variable,
				ptSerif.variable,
				jetBrainsMono.variable,
				"font-sans",
			)}
		>
			<body className="min-h-full flex flex-col" suppressHydrationWarning>
				<ThemeProvider>
					<QueryProvider>
						<AuthBootstrap>
							<TooltipProvider>{children}</TooltipProvider>
							<Toaster richColors position="bottom-right" />
						</AuthBootstrap>
					</QueryProvider>
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	);
}
