// Deprecated: route moved to app/[lang]/(main)/search/page.tsx
import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/i18n/dictionaries";

export default function SearchPage() {
	redirect(`/${DEFAULT_LOCALE}/search`);
}
