import type { SuggestionStats } from "@/features/suggestions";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	CheckCircle2Icon,
	ClockIcon,
	MessageSquareIcon,
	XCircleIcon,
} from "lucide-react";
import type { FC, ReactNode } from "react";

interface AdminSuggestionsStatsProps {
	dict: Dictionary["adminSuggestions"]["stats"];
	data: SuggestionStats | undefined;
	isLoading: boolean;
}

interface StatCardProps {
	icon: ReactNode;
	tone: "primary" | "warning" | "success" | "danger";
	label: string;
	value: number;
	loading: boolean;
}

const TONE_CLASS: Record<StatCardProps["tone"], string> = {
	primary: "bg-primary-dim text-primary",
	warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
	success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
	danger: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const StatCard: FC<StatCardProps> = ({ icon, tone, label, value, loading }) => (
	<article className="rounded-lg border border-border bg-surface p-5 transition-all duration-150 hover:border-edge-hover hover:bg-surface-hover hover:-translate-y-0.5 hover:shadow-md">
		<div
			className={cn(
				"size-9 rounded-md flex items-center justify-center mb-3",
				TONE_CLASS[tone],
			)}
		>
			{icon}
		</div>
		<div className="text-xs text-muted-foreground font-medium mb-1">
			{label}
		</div>
		{loading ? (
			<div className="h-7 w-16 rounded-sm bg-surface-active animate-pulse" />
		) : (
			<div className="text-2xl font-bold tracking-tight tabular-nums leading-none text-foreground">
				{value}
			</div>
		)}
	</article>
);

export const AdminSuggestionsStats: FC<AdminSuggestionsStatsProps> = ({
	dict,
	data,
	isLoading,
}) => (
	<div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
		<StatCard
			icon={<MessageSquareIcon className="size-[18px]" />}
			tone="primary"
			label={dict.total}
			value={data?.total ?? 0}
			loading={isLoading}
		/>
		<StatCard
			icon={<ClockIcon className="size-[18px]" />}
			tone="warning"
			label={dict.pending}
			value={data?.pending ?? 0}
			loading={isLoading}
		/>
		<StatCard
			icon={<CheckCircle2Icon className="size-[18px]" />}
			tone="success"
			label={dict.approved}
			value={data?.approved ?? 0}
			loading={isLoading}
		/>
		<StatCard
			icon={<XCircleIcon className="size-[18px]" />}
			tone="danger"
			label={dict.rejected}
			value={data?.rejected ?? 0}
			loading={isLoading}
		/>
	</div>
);
