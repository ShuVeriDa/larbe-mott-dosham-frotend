import { cn } from "@/shared/lib";
import Link from "next/link";
import type { FC, ReactNode } from "react";

interface StateProps {
	title?: string;
	description?: string;
	icon?: ReactNode;
	action?: ReactNode;
	className?: string;
}

export const AdminEmptyState: FC<StateProps> = ({
	title,
	description,
	icon,
	action,
	className,
}) => (
	<div
		className={cn(
			"bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-10 text-center",
			className,
		)}
	>
		{icon ? <div className="text-3xl mb-3 opacity-60">{icon}</div> : null}
		{title ? (
			<div className="text-lg font-semibold text-[var(--text)] mb-2">
				{title}
			</div>
		) : null}
		{description ? (
			<p className="text-sm text-[var(--text-muted)] max-w-md mx-auto mb-4">
				{description}
			</p>
		) : null}
		{action}
	</div>
);

interface ErrorStateProps extends StateProps {
	onRetry?: () => void;
	retryLabel: string;
}

export const AdminErrorState: FC<ErrorStateProps> = ({
	title,
	description,
	onRetry,
	retryLabel,
	className,
}) => (
	<div
		className={cn(
			"bg-[var(--danger-dim)] border border-[var(--danger)] text-[var(--text)] rounded-2xl p-6 text-center",
			className,
		)}
	>
		{title ? (
			<div className="text-lg font-semibold mb-2">{title}</div>
		) : null}
		{description ? (
			<p className="text-sm text-[var(--text-secondary)] mb-4">
				{description}
			</p>
		) : null}
		{onRetry ? (
			<button
				type="button"
				onClick={onRetry}
				className="btn btn-sm btn-secondary"
			>
				{retryLabel}
			</button>
		) : null}
	</div>
);

interface LoginRequiredProps {
	title: string;
	description: string;
	ctaLabel: string;
	lang: string;
}

export const AdminLoginRequired: FC<LoginRequiredProps> = ({
	title,
	description,
	ctaLabel,
	lang,
}) => (
	<div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-10 text-center">
		<div className="text-3xl mb-3">🔒</div>
		<div className="text-lg font-semibold text-[var(--text)] mb-2">
			{title}
		</div>
		<p className="text-sm text-[var(--text-muted)] max-w-md mx-auto mb-4">
			{description}
		</p>
		<Link href={`/${lang}/auth`} className="btn btn-md btn-primary">
			{ctaLabel}
		</Link>
	</div>
);

interface ForbiddenProps {
	title: string;
	description: string;
}

export const AdminForbidden: FC<ForbiddenProps> = ({ title, description }) => (
	<div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-10 text-center">
		<div className="text-3xl mb-3">⛔</div>
		<div className="text-lg font-semibold text-[var(--text)] mb-2">
			{title}
		</div>
		<p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
			{description}
		</p>
	</div>
);

interface SkeletonProps {
	rows?: number;
	className?: string;
}

export const AdminTableSkeleton: FC<SkeletonProps> = ({
	rows = 6,
	className,
}) => (
	<div
		className={cn(
			"bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 space-y-3",
			className,
		)}
	>
		{Array.from({ length: rows }).map((_, i) => (
			<div
				key={i}
				className="h-10 rounded-md animate-pulse"
				style={{
					background:
						"linear-gradient(90deg, var(--skeleton-from), var(--skeleton-to), var(--skeleton-from))",
					backgroundSize: "200% 100%",
				}}
			/>
		))}
	</div>
);
