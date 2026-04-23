"use client";

import {
	type ApiKeyRole,
	type ApiKeyStatus,
	type ApiKeyWithSecret,
	useAdminApiKeys,
	useAdminApiKeysStats,
	useCreateApiKey,
	useRevokeApiKey,
} from "@/features/admin-api-keys";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	AdminEmptyState,
	AdminErrorState,
	AdminTableSkeleton,
	PageHeader,
	StatCard,
	formatStatValue,
} from "@/shared/ui/admin";
import type { FC } from "react";
import { useState } from "react";

interface AdminApiKeysPageProps {
	lang: Locale;
	dict: Dictionary["admin"]["apiKeys"];
	commonDict: Dictionary["admin"]["common"];
}

const STATUS_DOT: Record<ApiKeyStatus, string> = {
	active: "bg-[var(--success)]",
	revoked: "bg-[var(--danger)]",
	expired: "bg-[var(--warning)]",
};

const formatDate = (iso: string | null) => {
	if (!iso) return "—";
	try {
		return new Date(iso).toLocaleDateString("ru-RU", {
			day: "2-digit",
			month: "short",
			year: "2-digit",
		});
	} catch {
		return iso;
	}
};

export const AdminApiKeysPage: FC<AdminApiKeysPageProps> = ({
	lang,
	dict,
	commonDict,
}) => {
	const [q, setQ] = useState("");
	const [role, setRole] = useState<ApiKeyRole | "">("");
	const [status, setStatus] = useState<ApiKeyStatus | "">("");
	const [page, setPage] = useState(1);

	const [createOpen, setCreateOpen] = useState(false);
	const [newName, setNewName] = useState("");
	const [newRole, setNewRole] = useState<ApiKeyRole>("readonly");
	const [created, setCreated] = useState<ApiKeyWithSecret | null>(null);

	const statsQuery = useAdminApiKeysStats();
	const listQuery = useAdminApiKeys({ q, role, status, page, limit: 25 });
	const createMutation = useCreateApiKey();
	const revokeMutation = useRevokeApiKey();

	const submitCreate = async () => {
		if (!newName.trim()) return;
		const key = await createMutation.mutateAsync({
			name: newName.trim(),
			role: newRole,
		});
		setCreated(key);
		setNewName("");
	};

	const closeCreate = () => {
		setCreateOpen(false);
		setCreated(null);
		setNewName("");
	};

	return (
		<article className="max-w-[1200px] mx-auto">
			<PageHeader
				title={dict.header.title}
				subtitle={dict.header.subtitle}
				actions={
					<button
						type="button"
						onClick={() => setCreateOpen(true)}
						className="btn btn-sm btn-primary"
					>
						{dict.header.create}
					</button>
				}
			/>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
				<StatCard
					tone="total"
					label={dict.stats.total}
					value={formatStatValue(statsQuery.data?.total)}
					loading={statsQuery.isLoading}
				/>
				<StatCard
					tone="success"
					label={dict.stats.active}
					value={formatStatValue(statsQuery.data?.active)}
					loading={statsQuery.isLoading}
				/>
				<StatCard
					tone="danger"
					label={dict.stats.revoked}
					value={formatStatValue(statsQuery.data?.revoked)}
					loading={statsQuery.isLoading}
				/>
				<StatCard
					tone="warning"
					label={dict.stats.expired}
					value={formatStatValue(statsQuery.data?.expired)}
					loading={statsQuery.isLoading}
				/>
			</div>

			<div className="flex gap-3 mb-4 flex-wrap items-center">
				<input
					type="text"
					value={q}
					onChange={(e) => {
						setQ(e.target.value);
						setPage(1);
					}}
					placeholder={commonDict.search}
					className="min-w-[240px] bg-[var(--surface)] border border-[var(--border)] rounded-md px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
				/>
				<select
					value={role}
					onChange={(e) => setRole(e.target.value as ApiKeyRole | "")}
					className="bg-[var(--surface)] border border-[var(--border)] rounded-md px-3 py-2 text-sm text-[var(--text)]"
				>
					<option value="">—</option>
					<option value="readonly">{dict.roles.readonly}</option>
					<option value="editor">{dict.roles.editor}</option>
					<option value="full">{dict.roles.full}</option>
					<option value="admin">{dict.roles.admin}</option>
				</select>
				<select
					value={status}
					onChange={(e) => setStatus(e.target.value as ApiKeyStatus | "")}
					className="bg-[var(--surface)] border border-[var(--border)] rounded-md px-3 py-2 text-sm text-[var(--text)]"
				>
					<option value="">—</option>
					<option value="active">{dict.statuses.active}</option>
					<option value="revoked">{dict.statuses.revoked}</option>
					<option value="expired">{dict.statuses.expired}</option>
				</select>
			</div>

			{listQuery.isLoading ? (
				<AdminTableSkeleton rows={6} />
			) : listQuery.isError ? (
				<AdminErrorState
					title={commonDict.error}
					retryLabel={commonDict.retry}
					onRetry={() => listQuery.refetch()}
				/>
			) : !listQuery.data?.data.length ? (
				<AdminEmptyState title={commonDict.empty} />
			) : (
				<div className="overflow-x-auto border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-[var(--border)]">
								<th className="text-left px-4 py-3 text-xs uppercase text-[var(--text-muted)]">
									{dict.columns.name}
								</th>
								<th className="text-left px-4 py-3 text-xs uppercase text-[var(--text-muted)]">
									{dict.columns.prefix}
								</th>
								<th className="text-left px-4 py-3 text-xs uppercase text-[var(--text-muted)]">
									{dict.columns.role}
								</th>
								<th className="text-left px-4 py-3 text-xs uppercase text-[var(--text-muted)]">
									{dict.columns.status}
								</th>
								<th className="text-left px-4 py-3 text-xs uppercase text-[var(--text-muted)] hidden md:table-cell">
									{dict.columns.createdAt}
								</th>
								<th className="text-left px-4 py-3 text-xs uppercase text-[var(--text-muted)] hidden md:table-cell">
									{dict.columns.lastUsed}
								</th>
								<th className="text-right px-4 py-3 text-xs uppercase text-[var(--text-muted)]">
									{commonDict.edit}
								</th>
							</tr>
						</thead>
						<tbody>
							{listQuery.data.data.map((key) => (
								<tr
									key={key.id}
									className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface-hover)]"
								>
									<td className="px-4 py-3 font-medium text-[var(--text)]">
										{key.name}
									</td>
									<td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">
										{key.prefix}…
									</td>
									<td className="px-4 py-3 text-xs">
										<span className="px-1.5 py-0.5 rounded bg-[var(--accent-dim)] text-[var(--accent)] font-mono">
											{dict.roles[key.role]}
										</span>
									</td>
									<td className="px-4 py-3">
										<span className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
											<span
												className={cn(
													"w-2 h-2 rounded-full",
													STATUS_DOT[key.status],
												)}
												aria-hidden
											/>
											{dict.statuses[key.status]}
										</span>
									</td>
									<td className="px-4 py-3 text-xs text-[var(--text-muted)] hidden md:table-cell">
										{formatDate(key.createdAt)}
									</td>
									<td className="px-4 py-3 text-xs text-[var(--text-muted)] hidden md:table-cell">
										{formatDate(key.lastUsedAt)}
									</td>
									<td className="px-4 py-3 text-right">
										{key.status === "active" ? (
											<button
												type="button"
												disabled={revokeMutation.isPending}
												onClick={() => {
													if (
														window.confirm(
															dict.revoke.text
																.replace("{name}", key.name)
																.replace("{prefix}", key.prefix),
														)
													) {
														revokeMutation.mutate({ id: key.id });
													}
												}}
												className="btn btn-sm btn-secondary text-[var(--danger)]"
											>
												🚫
											</button>
										) : null}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{createOpen ? (
				<div
					className="fixed inset-0 bg-black/60 z-[90] flex items-center justify-center p-4"
					onClick={closeCreate}
					onKeyDown={(e) => {
						if (e.key === "Escape") closeCreate();
					}}
					role="dialog"
					aria-modal="true"
				>
					<div
						className="bg-[var(--bg-raised)] border border-[var(--border)] rounded-2xl max-w-md w-full p-6"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
						role="document"
					>
						<h3 className="text-lg font-semibold text-[var(--text)] mb-4">
							{created ? dict.create.title : dict.create.title}
						</h3>

						{!created ? (
							<>
								<label className="text-xs text-[var(--text-muted)] block mb-1">
									{dict.create.name}
								</label>
								<input
									type="text"
									value={newName}
									onChange={(e) => setNewName(e.target.value)}
									placeholder={dict.create.namePlaceholder}
									className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-md px-3 py-2 text-sm text-[var(--text)] mb-3 outline-none focus:border-[var(--accent)]"
								/>
								<label className="text-xs text-[var(--text-muted)] block mb-1">
									{dict.create.role}
								</label>
								<select
									value={newRole}
									onChange={(e) => setNewRole(e.target.value as ApiKeyRole)}
									className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-md px-3 py-2 text-sm text-[var(--text)] mb-4"
								>
									<option value="readonly">
										{dict.roles.readonly} — {dict.roleDescriptions.readonly}
									</option>
									<option value="editor">
										{dict.roles.editor} — {dict.roleDescriptions.editor}
									</option>
									<option value="full">
										{dict.roles.full} — {dict.roleDescriptions.full}
									</option>
									<option value="admin">
										{dict.roles.admin} — {dict.roleDescriptions.admin}
									</option>
								</select>
								<div className="flex justify-end gap-2">
									<button
										type="button"
										onClick={closeCreate}
										className="btn btn-sm btn-secondary"
									>
										{commonDict.cancel}
									</button>
									<button
										type="button"
										onClick={submitCreate}
										disabled={!newName.trim() || createMutation.isPending}
										className="btn btn-md btn-primary disabled:opacity-40"
									>
										{dict.create.submit}
									</button>
								</div>
							</>
						) : (
							<>
								<div className="bg-[var(--warning-dim)] border border-[var(--warning)] text-[var(--text)] rounded-md p-3 text-xs mb-3">
									{dict.create.secretWarning}
								</div>
								<div className="bg-[var(--code-bg)] border border-[var(--code-border)] rounded-md p-3 font-mono text-xs break-all mb-4">
									{created.secret}
								</div>
								<div className="flex justify-end gap-2">
									<button
										type="button"
										onClick={() => {
											navigator.clipboard.writeText(created.secret).catch(() => {
												// no-op
											});
										}}
										className="btn btn-sm btn-secondary"
									>
										{dict.create.copy}
									</button>
									<button
										type="button"
										onClick={closeCreate}
										className="btn btn-sm btn-primary"
									>
										{commonDict.close}
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			) : null}
		</article>
	);
};
