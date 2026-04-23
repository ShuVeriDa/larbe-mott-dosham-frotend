"use client";

import {
	type BulkOperation,
	useBulkUpdateAdminEntries,
} from "@/features/admin-entries";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import {
	Breadcrumb,
	PageHeader,
	SectionCard,
	StatCard,
} from "@/shared/ui/admin";
import type { FC } from "react";
import { useState } from "react";

interface AdminEntriesBulkPageProps {
	lang: Locale;
	dict: Dictionary["admin"]["entriesBulk"];
	entriesDict: Dictionary["admin"]["entries"];
	commonDict: Dictionary["admin"]["common"];
}

type Step = 1 | 2 | 3 | 4;

const FIELDS: { value: string; label: string }[] = [
	{ value: "partOfSpeech", label: "partOfSpeech" },
	{ value: "partOfSpeechNah", label: "partOfSpeechNah" },
	{ value: "nounClass", label: "nounClass" },
	{ value: "nounClassPlural", label: "nounClassPlural" },
	{ value: "cefrLevel", label: "cefrLevel" },
	{ value: "entryType", label: "entryType" },
	{ value: "domain", label: "domain" },
	{ value: "styleLabel", label: "styleLabel" },
	{ value: "latinName", label: "latinName" },
];

export const AdminEntriesBulkPage: FC<AdminEntriesBulkPageProps> = ({
	lang,
	dict,
	entriesDict,
	commonDict,
}) => {
	const [step, setStep] = useState<Step>(1);
	const [idsInput, setIdsInput] = useState("");
	const [operations, setOperations] = useState<BulkOperation[]>([
		{ field: FIELDS[0].value, value: "" },
	]);

	const mutation = useBulkUpdateAdminEntries();

	const parsedIds = idsInput
		.split(/[\s,]+/)
		.map((s) => Number.parseInt(s.trim(), 10))
		.filter((n) => Number.isFinite(n) && n > 0)
		.slice(0, 100);

	const canProceedToStep2 = parsedIds.length > 0;
	const canProceedToStep3 = operations.every(
		(op) => op.field && op.value !== "",
	);

	const apply = async () => {
		try {
			await mutation.mutateAsync({ entryIds: parsedIds, operations });
			setStep(4);
		} catch {
			// Error state is surfaced via mutation.isError
		}
	};

	const steps: { n: Step; label: string }[] = [
		{ n: 1, label: dict.steps.select },
		{ n: 2, label: dict.steps.operation },
		{ n: 3, label: dict.steps.preview },
		{ n: 4, label: dict.steps.result },
	];

	return (
		<article className="max-w-[1100px] mx-auto">
			<Breadcrumb
				items={[
					{ label: entriesDict.header.title, href: `/${lang}/admin/entries` },
					{ label: dict.header.title },
				]}
			/>
			<PageHeader title={dict.header.title} subtitle={dict.header.subtitle} />

			<div className="flex items-center gap-2 mb-8 flex-wrap">
				{steps.map((s, i) => (
					<div key={s.n} className="flex items-center gap-2">
						<div
							className={cn(
								"w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
								step === s.n
									? "bg-[var(--accent)] text-[var(--accent-on)]"
									: step > s.n
										? "bg-[var(--success-dim)] text-[var(--success)]"
										: "bg-[var(--surface)] text-[var(--text-muted)]",
							)}
						>
							{s.n}
						</div>
						<span className="text-sm text-[var(--text-secondary)]">
							{s.label}
						</span>
						{i < steps.length - 1 ? (
							<div className="w-8 h-px bg-[var(--border)]" />
						) : null}
					</div>
				))}
			</div>

			{step === 1 && (
				<SectionCard title={dict.select.byIds}>
					<textarea
						value={idsInput}
						onChange={(e) => setIdsInput(e.target.value)}
						placeholder={dict.select.idsPlaceholder}
						rows={6}
						className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-md p-3 text-sm text-[var(--text)] font-mono outline-none focus:border-[var(--accent)]"
					/>
					<div className="text-xs text-[var(--text-muted)] mt-2">
						{dict.select.maxHint}
					</div>
					<div className="text-sm text-[var(--text-secondary)] mt-3 mb-4">
						{dict.select.selectedCount.replace(
							"{count}",
							String(parsedIds.length),
						)}
					</div>
					<div className="flex justify-end">
						<button
							type="button"
							disabled={!canProceedToStep2}
							onClick={() => setStep(2)}
							className="btn btn-md btn-primary disabled:opacity-40"
						>
							{commonDict.next}
						</button>
					</div>
				</SectionCard>
			)}

			{step === 2 && (
				<SectionCard title={dict.operation.title}>
					<div className="bg-[var(--warning-dim)] border border-[var(--warning)] text-[var(--text)] rounded-md p-3 text-sm mb-4">
						⚠️ {dict.operation.warning}
					</div>
					<div className="space-y-3">
						{operations.map((op, i) => (
							<div key={i} className="flex gap-2 items-start">
								<select
									value={op.field}
									onChange={(e) => {
										const v = e.target.value;
										setOperations((prev) =>
											prev.map((p, idx) => (idx === i ? { ...p, field: v } : p)),
										);
									}}
									className="bg-[var(--bg-raised)] border border-[var(--border)] rounded-md px-3 py-2 text-sm text-[var(--text)] min-w-[180px]"
								>
									{FIELDS.map((f) => (
										<option key={f.value} value={f.value}>
											{f.label}
										</option>
									))}
								</select>
								<input
									type="text"
									value={String(op.value ?? "")}
									onChange={(e) => {
										const v = e.target.value;
										setOperations((prev) =>
											prev.map((p, idx) => (idx === i ? { ...p, value: v } : p)),
										);
									}}
									placeholder={dict.operation.value}
									className="flex-1 bg-[var(--bg-raised)] border border-[var(--border)] rounded-md px-3 py-2 text-sm text-[var(--text)]"
								/>
								{operations.length > 1 ? (
									<button
										type="button"
										onClick={() =>
											setOperations((prev) => prev.filter((_, idx) => idx !== i))
										}
										className="btn btn-sm btn-ghost"
									>
										✕
									</button>
								) : null}
							</div>
						))}
					</div>
					<button
						type="button"
						onClick={() =>
							setOperations((prev) => [
								...prev,
								{ field: FIELDS[0].value, value: "" },
							])
						}
						className="btn btn-sm btn-secondary mt-3"
					>
						{dict.operation.addOperation}
					</button>

					<div className="flex items-center justify-between mt-5">
						<button
							type="button"
							onClick={() => setStep(1)}
							className="btn btn-sm btn-secondary"
						>
							{commonDict.previous}
						</button>
						<button
							type="button"
							disabled={!canProceedToStep3}
							onClick={() => setStep(3)}
							className="btn btn-md btn-primary disabled:opacity-40"
						>
							{commonDict.next}
						</button>
					</div>
				</SectionCard>
			)}

			{step === 3 && (
				<SectionCard title={dict.preview.title}>
					<div className="text-xs font-mono text-[var(--text-muted)] mb-3">
						PATCH /api/admin/dictionary/bulk/update
					</div>
					<div className="text-sm text-[var(--text-secondary)] mb-4">
						{parsedIds.length} × {operations.length} операций
					</div>
					<pre className="text-xs bg-[var(--code-bg)] border border-[var(--code-border)] rounded-md p-3 overflow-auto font-mono">
{JSON.stringify({ entryIds: parsedIds, operations }, null, 2)}
					</pre>

					<div className="flex items-center justify-between mt-5">
						<button
							type="button"
							onClick={() => setStep(2)}
							className="btn btn-sm btn-secondary"
						>
							{commonDict.previous}
						</button>
						<button
							type="button"
							onClick={apply}
							disabled={mutation.isPending}
							className="btn btn-md btn-primary disabled:opacity-40"
						>
							{dict.preview.apply}
						</button>
					</div>
					{mutation.isError ? (
						<div className="text-sm text-[var(--danger)] mt-3">
							{commonDict.error}
						</div>
					) : null}
				</SectionCard>
			)}

			{step === 4 && mutation.data && (
				<SectionCard title={dict.result.success}>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<StatCard
							tone="success"
							label={dict.result.stats.updated}
							value={mutation.data.updated}
						/>
						<StatCard
							tone="info"
							label={dict.result.stats.fields}
							value={mutation.data.fieldsChanged}
						/>
						<StatCard
							tone="warning"
							label={dict.result.stats.skipped}
							value={mutation.data.skipped}
						/>
						<StatCard
							tone="total"
							label={dict.result.stats.elapsed}
							value={`${mutation.data.elapsedMs} ms`}
						/>
					</div>
				</SectionCard>
			)}
		</article>
	);
};
