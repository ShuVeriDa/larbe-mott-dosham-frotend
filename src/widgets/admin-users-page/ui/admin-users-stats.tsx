import type { AdminUsersStats as AdminUsersStatsData } from "@/features/admin-users";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	CircleCheckBigIcon,
	CircleDashedIcon,
	ShieldIcon,
	UsersIcon,
} from "lucide-react";
import type { FC, ReactNode } from "react";

interface AdminUsersStatsProps {
	dict: Dictionary["adminUsers"]["stats"];
	data: AdminUsersStatsData | undefined;
	isLoading: boolean;
}

interface StatCardProps {
	icon: ReactNode;
	tone: "primary" | "success" | "warning" | "info";
	label: string;
	value: number | string;
	sub: string;
	loading: boolean;
}

const TONE_CLASS: Record<StatCardProps["tone"], string> = {
	primary: "bg-primary-dim text-primary",
	success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
	warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
	info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

const StatCard: FC<StatCardProps> = ({ icon, tone, label, value, sub, loading }) => (
	<article className="rounded-lg border border-border bg-surface p-5 transition-all duration-150 hover:border-edge-hover hover:bg-surface-hover hover:-translate-y-0.5 hover:shadow-md">
		<div
			className={cn(
				"size-10 rounded-md flex items-center justify-center mb-3",
				TONE_CLASS[tone],
			)}
		>
			{icon}
		</div>
		<div className="text-xs text-muted-foreground font-medium mb-2">
			{label}
		</div>
		{loading ? (
			<div className="h-7 w-16 rounded-sm bg-surface-active animate-pulse mb-2" />
		) : (
			<div className="text-2xl font-bold tracking-tight tabular-nums leading-none mb-2 text-foreground">
				{value}
			</div>
		)}
		<div className="text-xs text-muted-foreground">{sub}</div>
	</article>
);

export const AdminUsersStats: FC<AdminUsersStatsProps> = ({
	dict,
	data,
	isLoading,
}) => {
	const total = data?.total ?? 0;
	const active = data?.active ?? 0;
	const inactive = data?.inactive ?? 0;
	const admins = data?.byRole?.ADMIN ?? 0;
	const editors = data?.byRole?.EDITOR ?? 0;
	const newThisMonth = data?.newThisMonth ?? 0;
	const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
			<StatCard
				icon={<UsersIcon className="size-[18px]" />}
				tone="primary"
				label={dict.total.label}
				value={total}
				sub={dict.total.sub.replace("{count}", String(newThisMonth))}
				loading={isLoading}
			/>
			<StatCard
				icon={<CircleCheckBigIcon className="size-[18px]" />}
				tone="success"
				label={dict.active.label}
				value={active}
				sub={dict.active.sub.replace("{percent}", String(activePercent))}
				loading={isLoading}
			/>
			<StatCard
				icon={<CircleDashedIcon className="size-[18px]" />}
				tone="warning"
				label={dict.inactive.label}
				value={inactive}
				sub={dict.inactive.sub}
				loading={isLoading}
			/>
			<StatCard
				icon={<ShieldIcon className="size-[18px]" />}
				tone="info"
				label={dict.adminsEditors.label}
				value={admins + editors}
				sub={dict.adminsEditors.sub
					.replace("{admins}", String(admins))
					.replace("{editors}", String(editors))}
				loading={isLoading}
			/>
		</div>
	);
};
