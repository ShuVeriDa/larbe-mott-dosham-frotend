import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/i18n/dictionaries";

// Proxy handles the redirect, but this is a fallback for direct root access
export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`);
}
