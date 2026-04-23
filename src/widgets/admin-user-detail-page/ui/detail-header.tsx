import type { AdminUserDetail } from "@/features/admin-users";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";
import Link from "next/link";
import type { FC } from "react";
import { avatarToneClass, getInitials, primaryRole } from "../lib/format";
import { RoleBadge } from "./role-badge";
import { UserStatusBadge } from "./status-badge";

interface DetailHeaderProps {
	user: AdminUserDetail;
	lang: Locale;
	dict: Dictionary["adminUserDetail"]["header"];
	rolesDict: Dictionary["adminUsers"]["roles"];
	statusesDict: Dictionary["adminUsers"]["statuses"];
}

export const DetailHeader: FC<DetailHeaderProps> = ({
	user,
	lang,
	dict,
	rolesDict,
	statusesDict,
}) => {
	const role = primaryRole(user);
	return (
		<header className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 flex-wrap">
			<div className="flex items-center gap-5 min-w-0">
				<div
					aria-hidden
					className={cn(
						"size-16 rounded-full flex items-center justify-center font-bold text-xl shrink-0",
						avatarToneClass(user.id),
					)}
				>
					{getInitials(user.name)}
				</div>
				<div className="min-w-0">
					<h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3 flex-wrap">
						<span className="truncate">{user.name}</span>
						<RoleBadge role={role} dict={rolesDict} />
						<UserStatusBadge status={user.status} dict={statusesDict} />
					</h1>
					<p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
						<span className="font-mono">@{user.username}</span>
						<span aria-hidden>·</span>
						<span className="truncate">{user.email}</span>
						<span aria-hidden>·</span>
						<span className="font-mono text-xs">
							ID: {user.id.slice(0, 8)}
						</span>
					</p>
				</div>
			</div>
			<div className="flex gap-2 items-center shrink-0">
				<Button asChild variant="secondary" size="md">
					<Link href={`/${lang}/admin/users`}>← {dict.backToList}</Link>
				</Button>
			</div>
		</header>
	);
};
