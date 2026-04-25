"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { StatCard } from "@/shared/ui/admin";
import {
	BanIcon,
	CheckCircle2Icon,
	ClockIcon,
	KeyRoundIcon,
} from "lucide-react";
import type { FC } from "react";
import type { KeyStats } from "../lib/format";

interface AdminApiKeysStatsProps {
	dict: Dictionary["admin"]["apiKeys"]["stats"];
	data: KeyStats;
	loading: boolean;
}

export const AdminApiKeysStats: FC<AdminApiKeysStatsProps> = ({
	dict,
	data,
	loading,
}) => (
	<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
		<StatCard
			icon={<KeyRoundIcon className="size-[18px]" />}
			tone="total"
			label={dict.total.label}
			value={data.total}
			sub={dict.total.sub}
			loading={loading}
		/>
		<StatCard
			icon={<CheckCircle2Icon className="size-[18px]" />}
			tone="success"
			label={dict.active.label}
			value={data.active}
			sub={dict.active.sub}
			loading={loading}
		/>
		<StatCard
			icon={<BanIcon className="size-[18px]" />}
			tone="danger"
			label={dict.revoked.label}
			value={data.revoked}
			sub={dict.revoked.sub}
			loading={loading}
		/>
		<StatCard
			icon={<ClockIcon className="size-[18px]" />}
			tone="warning"
			label={dict.expired.label}
			value={data.expired}
			sub={dict.expired.sub}
			loading={loading}
		/>
	</div>
);
