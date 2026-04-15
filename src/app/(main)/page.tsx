// Deprecated: route moved to app/[lang]/(main)/page.tsx
import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/i18n/dictionaries";

export default function Home() {
	redirect(`/${DEFAULT_LOCALE}`);
}
