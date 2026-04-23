import type { AdminUserDetail } from "@/features/admin-users";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { FC, ReactNode } from "react";
import { formatDate, formatDateTime, maskIp } from "../lib/format";
import { parseUserAgent } from "../lib/user-agent";

interface InfoCardProps {
	user: AdminUserDetail;
	lang: Locale;
	dict: Dictionary["adminUserDetail"]["info"];
}

interface RowProps {
	label: string;
	children: ReactNode;
	mono?: boolean;
	muted?: boolean;
	success?: boolean;
}

const Row: FC<RowProps> = ({ label, children, mono, muted, success }) => (
	<div className="flex justify-between items-center py-3 border-b border-border last:border-b-0 gap-4">
		<span className="text-xs text-muted-foreground font-medium shrink-0">
			{label}
		</span>
		<span
			className={`text-sm font-medium text-right max-w-[60%] break-words ${
				mono ? "font-mono text-xs" : ""
			} ${muted ? "text-muted-foreground" : "text-foreground"} ${
				success ? "!text-emerald-600 dark:!text-emerald-400" : ""
			}`}
		>
			{children}
		</span>
	</div>
);

export const InfoCard: FC<InfoCardProps> = ({ user, lang, dict }) => {
	const ua = parseUserAgent(user.lastSessionUserAgent);
	return (
		<section className="rounded-lg border border-border bg-surface overflow-hidden mb-6">
			<div className="px-5 py-4 border-b border-border">
				<h2 className="text-sm font-semibold text-foreground">{dict.title}</h2>
			</div>
			<div className="px-5 py-2">
				<Row label={dict.id} mono muted>
					{user.id.slice(0, 12)}
				</Row>
				<Row label={dict.registered}>
					{formatDate(user.createdAt, lang) ?? "—"}
				</Row>
				<Row label={dict.lastLogin}>
					{formatDateTime(user.lastLoggedIn, lang) ?? dict.never}
				</Row>
				<Row label={dict.ip} mono>
					{maskIp(user.lastSessionIp)}
				</Row>
				<Row label={dict.userAgent} muted>
					{ua.label}
				</Row>
				<Row
					label={dict.emailVerified}
					success={user.emailVerified}
					muted={!user.emailVerified}
				>
					{user.emailVerified ? `✓ ${dict.verified}` : dict.notVerified}
				</Row>
			</div>
		</section>
	);
};
