"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { AdminTableSkeleton } from "@/shared/ui/admin";
import { Button } from "@/shared/ui";
import type { FC } from "react";

interface EmptyProps {
	dict: Dictionary["admin"]["apiKeys"]["empty"];
}

export const AdminApiKeysEmpty: FC<EmptyProps> = ({ dict }) => (
	<div className="text-center py-16 px-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
		<div className="text-3xl mb-3 opacity-60" aria-hidden>
			🔑
		</div>
		<h2 className="text-lg font-semibold text-[var(--text)] mb-2">
			{dict.title}
		</h2>
		<p className="max-w-sm mx-auto text-sm text-[var(--text-muted)]">
			{dict.text}
		</p>
	</div>
);

interface NoResultsProps {
	dict: Dictionary["admin"]["apiKeys"]["noResults"];
	onReset: () => void;
}

export const AdminApiKeysNoResults: FC<NoResultsProps> = ({
	dict,
	onReset,
}) => (
	<div className="text-center py-12 px-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
		<h2 className="text-lg font-semibold text-[var(--text)] mb-2">
			{dict.title}
		</h2>
		<p className="max-w-sm mx-auto mb-6 text-sm text-[var(--text-muted)]">
			{dict.text}
		</p>
		<Button variant="secondary" size="sm" onClick={onReset}>
			{dict.reset}
		</Button>
	</div>
);

interface ErrorProps {
	dict: Dictionary["admin"]["apiKeys"]["error"];
	onRetry: () => void;
}

export const AdminApiKeysError: FC<ErrorProps> = ({ dict, onRetry }) => (
	<div className="bg-[var(--danger-dim)] border border-[var(--danger)] rounded-2xl p-6 text-center">
		<h2 className="text-lg font-semibold text-[var(--text)] mb-2">
			{dict.title}
		</h2>
		<p className="text-sm text-[var(--text-secondary)] mb-4">{dict.text}</p>
		<Button variant="secondary" size="sm" onClick={onRetry}>
			{dict.retry}
		</Button>
	</div>
);

export const AdminApiKeysSkeleton: FC = () => <AdminTableSkeleton rows={6} />;
