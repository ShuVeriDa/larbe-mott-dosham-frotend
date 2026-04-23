"use client";

import type { UserSession } from "@/entities/user";
import { useRevokeSession } from "@/features/auth";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { Monitor, Smartphone } from "lucide-react";
import { type FC } from "react";
import { toast } from "sonner";
import { formatDateTime } from "../lib/format-date";
import { parseUserAgent } from "../lib/parse-user-agent";

interface SessionItemProps {
	session: UserSession;
	lang: Locale;
	dict: Dictionary["profile"]["sessions"];
}

export const SessionItem: FC<SessionItemProps> = ({ session, lang, dict }) => {
	const { mutateAsync, isPending } = useRevokeSession();
	const parsed = parseUserAgent(session.userAgent);

	const handleRevoke = async () => {
		try {
			await mutateAsync(session.id);
			toast.success(dict.revokeSuccess);
		} catch {
			toast.error(dict.revokeError);
		}
	};

	return (
		<div
			className={cn(
				"flex items-center gap-4 p-4 bg-surface border border-edge rounded-md mb-3",
				"transition-all duration-300",
				isPending && "opacity-60 pointer-events-none",
			)}
		>
			<div
				aria-hidden
				className="w-9 h-9 rounded-md bg-surface-hover text-muted flex items-center justify-center shrink-0"
			>
				{parsed.icon === "mobile" ? (
					<Smartphone size={16} />
				) : (
					<Monitor size={16} />
				)}
			</div>
			<div className="flex-1 min-w-0">
				<div className="text-sm font-medium flex items-center gap-2 flex-wrap">
					<span>
						{parsed.browser} · {parsed.os}
					</span>
					{session.isCurrent && (
						<span className="text-xs text-success font-semibold">
							{dict.current}
						</span>
					)}
				</div>
				<div className="text-xs text-muted">
					{session.ipAddress ?? "—"} · {formatDateTime(session.lastActiveAt, lang)}
				</div>
			</div>
			{!session.isCurrent && (
				<button
					type="button"
					onClick={handleRevoke}
					disabled={isPending}
					className={cn(
						"text-xs text-faint px-2 py-1 rounded-sm cursor-pointer",
						"transition-colors duration-150",
						"hover:text-danger hover:bg-danger/10 disabled:opacity-50",
					)}
				>
					{dict.revoke}
				</button>
			)}
		</div>
	);
};
