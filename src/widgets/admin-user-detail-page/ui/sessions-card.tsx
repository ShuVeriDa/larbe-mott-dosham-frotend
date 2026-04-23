import type { AdminUserSessionItem } from "@/features/admin-users";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import type { FC } from "react";
import { formatDateTime, maskIp } from "../lib/format";
import { parseUserAgent } from "../lib/user-agent";

interface SessionsCardProps {
	sessions: AdminUserSessionItem[];
	isLoading: boolean;
	lang: Locale;
	dict: Dictionary["adminUserDetail"]["sessions"];
	onRevoke: (sessionId: string) => void;
	onRevokeAll: () => void;
	isRevoking: boolean;
	isRevokingAll: boolean;
}

export const SessionsCard: FC<SessionsCardProps> = ({
	sessions,
	isLoading,
	lang,
	dict,
	onRevoke,
	onRevokeAll,
	isRevoking,
	isRevokingAll,
}) => (
	<section className="rounded-lg border border-border bg-surface overflow-hidden mb-6">
		<div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
			<h2 className="text-sm font-semibold text-foreground">{dict.title}</h2>
			{sessions.length > 1 && (
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="text-red-600 dark:text-red-400 text-xs"
					onClick={onRevokeAll}
					disabled={isRevokingAll}
				>
					{isRevokingAll ? dict.revokingAll : dict.revokeAll}
				</Button>
			)}
		</div>
		<div className="px-5 py-3">
			{isLoading ? (
				<ul className="flex flex-col gap-3" aria-busy>
					{[0, 1].map((i) => (
						<li key={i} className="flex gap-3 items-start animate-pulse">
							<div className="size-8 rounded-full bg-surface-active shrink-0" />
							<div className="flex-1 flex flex-col gap-2">
								<div className="h-3 w-1/2 bg-surface-active rounded-sm" />
								<div className="h-2.5 w-2/3 bg-surface-active rounded-sm" />
							</div>
						</li>
					))}
				</ul>
			) : sessions.length === 0 ? (
				<p className="py-6 text-center text-sm text-muted-foreground">
					{dict.empty}
				</p>
			) : (
				<ul className="list-none">
					{sessions.map((s) => {
						const ua = parseUserAgent(s.userAgent);
						return (
							<li
								key={s.id}
								className="flex gap-3 py-3 border-b border-border last:border-b-0 items-center"
							>
								<div
									aria-hidden
									className="size-8 rounded-full bg-primary-dim text-primary flex items-center justify-center text-sm shrink-0"
								>
									{ua.icon}
								</div>
								<div className="flex-1 min-w-0">
									<div className="text-sm font-semibold text-foreground truncate">
										{ua.label}
									</div>
									<div className="text-xs text-muted-foreground truncate">
										{maskIp(s.ipAddress)}
										{" · "}
										{s.isCurrent
											? dict.currentSession
											: formatDateTime(s.lastActiveAt, lang)}
									</div>
								</div>
								{s.isCurrent ? (
									<span className="inline-flex items-center gap-1 text-[0.6rem] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
										<span
											aria-hidden
											className="size-1.5 rounded-full bg-emerald-500"
										/>
										{dict.live}
									</span>
								) : (
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="text-red-600 dark:text-red-400 text-xs px-2 h-auto"
										aria-label={dict.revoke}
										onClick={() => onRevoke(s.id)}
										disabled={isRevoking}
									>
										✕
									</Button>
								)}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	</section>
);
