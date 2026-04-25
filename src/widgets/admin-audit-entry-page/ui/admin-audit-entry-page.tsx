"use client";

import { useAdminAuditForEntry } from "@/features/admin-audit";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import {
	AdminEmptyState,
	AdminErrorState,
	AdminTableSkeleton,
	Breadcrumb,
	PageHeader,
} from "@/shared/ui/admin";
import Link from "next/link";
import type { FC } from "react";
import { useRevertLog } from "../model/use-revert-log";
import { AuditTimeline } from "./audit-timeline";
import { EntrySummaryCard } from "./entry-summary-card";
import { RevertModal } from "./revert-modal";

interface AdminAuditEntryPageProps {
	id: string;
	lang: Locale;
	dict: Dictionary["admin"]["auditEntry"];
	auditDict: Dictionary["admin"]["audit"];
	commonDict: Dictionary["admin"]["common"];
}

export const AdminAuditEntryPage: FC<AdminAuditEntryPageProps> = ({
	id,
	lang,
	dict,
	auditDict,
	commonDict,
}) => {
	const entryId = Number(id);
	const isValidId = Number.isFinite(entryId);
	const query = useAdminAuditForEntry(entryId, { enabled: isValidId });

	const revert = useRevertLog({ entryId, dict: dict.revert });

	if (!isValidId) {
		return (
			<article className="max-w-[1100px] mx-auto">
				<AdminEmptyState
					icon="⚠️"
					title={dict.notFoundTitle}
					description={dict.notFoundText.replace("{id}", id)}
				/>
			</article>
		);
	}

	if (query.isLoading) {
		return (
			<article className="max-w-[1100px] mx-auto">
				<AdminTableSkeleton rows={8} />
			</article>
		);
	}

	if (query.isError || !query.data) {
		return (
			<article className="max-w-[1100px] mx-auto">
				<AdminErrorState
					title={commonDict.error}
					retryLabel={commonDict.retry}
					onRetry={() => query.refetch()}
				/>
			</article>
		);
	}

	const { entry, meta, items } = query.data;
	const subtitle = entry.word
		? dict.header.subtitle.replace("{word}", entry.word)
		: dict.header.subtitleNoWord;

	return (
		<article className="max-w-[1100px] mx-auto">
			<Breadcrumb
				items={[
					{ label: dict.breadcrumb.admin, href: `/${lang}/admin` },
					{ label: dict.breadcrumb.audit, href: `/${lang}/admin/audit` },
					{ label: `${entry.word} #${entry.id}` },
				]}
			/>

			<PageHeader
				title={dict.header.title}
				subtitle={subtitle}
				actions={
					<>
						<Link
							href={`/${lang}/admin/entries/${entry.id}/edit`}
							className="btn btn-md btn-secondary"
						>
							{dict.header.edit}
						</Link>
						<Link
							href={`/${lang}/entry/${entry.id}`}
							className="btn btn-md btn-ghost"
						>
							{dict.header.view}
						</Link>
					</>
				}
			/>

			<EntrySummaryCard entry={entry} meta={meta} dict={dict.summary} />

			{items.length === 0 ? (
				<AdminEmptyState icon="📭" title={dict.empty} />
			) : (
				<AuditTimeline
					items={items}
					lang={lang}
					dict={dict}
					auditDict={auditDict}
					onRevert={revert.open}
				/>
			)}

			<RevertModal
				open={revert.isOpen}
				isPending={revert.isPending}
				onOpenChange={(open) => {
					if (!open) revert.close();
				}}
				onConfirm={revert.confirm}
				dict={dict.revert}
			/>
		</article>
	);
};
