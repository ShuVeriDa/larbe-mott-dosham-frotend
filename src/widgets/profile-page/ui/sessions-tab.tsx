"use client";

import { useRevokeAllSessions, useSessions } from "@/features/auth";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import type { FC } from "react";
import { toast } from "sonner";
import { SessionItem } from "./session-item";

interface SessionsTabProps {
	lang: Locale;
	dict: Dictionary["profile"]["sessions"];
}

export const SessionsTab: FC<SessionsTabProps> = ({ lang, dict }) => {
	const { data: sessions, isLoading, isError } = useSessions();
	const revokeAll = useRevokeAllSessions();

	const handleRevokeAll = async () => {
		try {
			await revokeAll.mutateAsync();
			toast.success(dict.revokeAllSuccess);
		} catch {
			toast.error(dict.revokeError);
		}
	};

	const list = sessions ?? [];
	const hasOthers = list.some(s => !s.isCurrent);

	return (
		<section>
			<h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4 pb-2 border-b border-edge">
				{dict.title}
			</h2>

			{isLoading && <p className="text-sm text-muted">{dict.loading}</p>}
			{isError && <p className="text-sm text-danger">{dict.error}</p>}

			{!isLoading && !isError && list.length === 0 && (
				<p className="text-sm text-muted">{dict.empty}</p>
			)}

			{list.map(session => (
				<SessionItem
					key={session.id}
					session={session}
					lang={lang}
					dict={dict}
				/>
			))}

			{hasOthers && (
				<div className="mt-4">
					<Button
						variant="danger"
						size="sm"
						onClick={handleRevokeAll}
						disabled={revokeAll.isPending}
					>
						{dict.revokeAll}
					</Button>
				</div>
			)}
		</section>
	);
};
