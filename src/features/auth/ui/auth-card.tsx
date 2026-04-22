"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { useIsAuthenticated } from "@/shared/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FC } from "react";
import { AuthTabs, type AuthTab } from "./auth-tabs";
import { BottomLink } from "./bottom-link";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { ResetPasswordForm } from "./reset-password-form";

type AuthView = AuthTab | "reset";

interface AuthCardProps {
	dict: Dictionary["auth"];
	lang: Locale;
}

const isSafeRedirect = (value: string | null): value is string =>
	!!value && value.startsWith("/") && !value.startsWith("//");

export const AuthCard: FC<AuthCardProps> = ({ dict, lang }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const isAuthenticated = useIsAuthenticated();

	const returnUrl = searchParams.get("returnUrl");
	const redirectTo = isSafeRedirect(returnUrl) ? returnUrl : `/${lang}`;

	const [view, setView] = useState<AuthView>("login");

	useEffect(() => {
		if (isAuthenticated) router.replace(redirectTo);
	}, [isAuthenticated, redirectTo, router]);

	return (
		<>
			<section
				aria-label={dict.tabs.login}
				className="w-full rounded-xl border border-edge bg-raised p-8 shadow-[0_8px_40px_rgba(0,0,0,0.15)] max-sm:rounded-lg max-sm:p-6"
				style={{ animation: "cardIn .5s var(--ease-out) both" }}
			>
				{view !== "reset" && (
					<AuthTabs value={view} onChange={setView} labels={dict.tabs} />
				)}

				{view === "login" && (
					<LoginForm
						dict={dict}
						onForgotPassword={() => setView("reset")}
					/>
				)}

				{view === "register" && (
					<RegisterForm dict={dict} lang={lang} />
				)}

				{view === "reset" && (
					<ResetPasswordForm dict={dict} onBack={() => setView("login")} />
				)}
			</section>

			{view !== "reset" && (
				<BottomLink view={view} labels={dict.bottomLink} onSwitch={setView} />
			)}
		</>
	);
};
