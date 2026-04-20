"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import type { AuthTab } from "./auth-tabs";

interface BottomLinkProps {
	view: AuthTab;
	labels: Dictionary["auth"]["bottomLink"];
	onSwitch: (tab: AuthTab) => void;
}

export const BottomLink = ({ view, labels, onSwitch }: BottomLinkProps) => {
	const isLogin = view === "login";
	const prompt = isLogin ? labels.noAccount : labels.hasAccount;
	const action = isLogin ? labels.signUp : labels.signIn;
	const target: AuthTab = isLogin ? "register" : "login";

	return (
		<p className="mt-5 text-center text-sm text-muted">
			{prompt}{" "}
			<button
				type="button"
				onClick={() => onSwitch(target)}
				className="font-medium text-primary hover:underline"
			>
				{action}
			</button>
		</p>
	);
};
