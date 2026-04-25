import type { AuditItem } from "@/features/admin-audit";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import type { FC } from "react";
import { AuditTimelineItem } from "./audit-timeline-item";

interface AuditTimelineProps {
	items: AuditItem[];
	lang: Locale;
	dict: Dictionary["admin"]["auditEntry"];
	auditDict: Dictionary["admin"]["audit"];
	onRevert: (logId: string) => void;
}

export const AuditTimeline: FC<AuditTimelineProps> = ({
	items,
	lang,
	dict,
	auditDict,
	onRevert,
}) => (
	<ol className="relative pl-7 list-none">
		<span
			aria-hidden
			className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-[var(--border)] rounded"
		/>
		{items.map((item) => (
			<AuditTimelineItem
				key={item.id}
				item={item}
				lang={lang}
				dict={dict}
				auditDict={auditDict}
				onRevert={onRevert}
			/>
		))}
	</ol>
);
