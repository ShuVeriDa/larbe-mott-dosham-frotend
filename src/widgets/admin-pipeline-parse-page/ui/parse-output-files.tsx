"use client";

import type { PipelineParsedFile } from "@/features/admin-pipeline";
import type { Dictionary } from "@/i18n/dictionaries";
import { AdminErrorState, AdminTableSkeleton } from "@/shared/ui/admin";
import type { FC } from "react";
import { formatSizeMb } from "../lib/format-bytes";
import { formatRelativeTime } from "../lib/format-relative";

interface Props {
	dict: Dictionary["admin"]["pipelineParse"]["output"];
	statusDict: Dictionary["admin"]["pipeline"]["status"];
	commonDict: Dictionary["admin"]["common"];
	files: PipelineParsedFile[] | undefined;
	isLoading: boolean;
	isError: boolean;
	onRetry: () => void;
}

const PARSED_DIR = "dictionaries/parsed/";

export const ParseOutputFiles: FC<Props> = ({
	dict,
	statusDict,
	commonDict,
	files,
	isLoading,
	isError,
	onRetry,
}) => (
	<section aria-labelledby="parse-output-heading" className="mb-8">
		<header className="flex items-center justify-between gap-4 mb-4 flex-wrap">
			<h2
				id="parse-output-heading"
				className="text-lg font-semibold text-[var(--text)]"
			>
				{dict.title}
			</h2>
		</header>

		{isLoading ? (
			<AdminTableSkeleton rows={6} />
		) : isError ? (
			<AdminErrorState
				title={commonDict.error}
				retryLabel={commonDict.retry}
				onRetry={onRetry}
			/>
		) : (
			<div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
				<header className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
					<span aria-hidden>📁</span>
					<span className="flex-1 text-sm font-semibold text-[var(--text)] font-mono">
						{dict.dir.replace("{dir}", PARSED_DIR)}
					</span>
					<span className="text-xs text-[var(--text-muted)] bg-[var(--surface-active)] px-2 py-0.5 rounded-full">
						{dict.count.replace("{count}", `${files?.length ?? 0}`)}
					</span>
				</header>

				{!files?.length ? (
					<div className="text-sm text-[var(--text-muted)] text-center py-8">
						{dict.empty}
					</div>
				) : (
					<ul className="divide-y divide-[var(--border)]">
						{files.map((file) => (
							<li
								key={file.filename}
								className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-[var(--surface-hover)] transition-colors"
							>
								<span
									className="text-[var(--text-muted)] text-sm shrink-0"
									aria-hidden
								>
									📄
								</span>
								<span className="flex-1 min-w-0 font-mono text-xs text-[var(--text)] truncate">
									{file.filename}
								</span>
								<span className="text-xs text-[var(--text-muted)] tabular-nums shrink-0">
									{formatSizeMb(file.sizeMb)}
								</span>
								<span className="text-xs text-[var(--text-faint)] shrink-0 hidden sm:block">
									{formatRelativeTime(file.updatedAt, statusDict)}
								</span>
							</li>
						))}
					</ul>
				)}
			</div>
		)}
	</section>
);
