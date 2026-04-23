import type { QualitySourceStat } from "@/features/admin-quality";
import type { FC } from "react";

const nf = new Intl.NumberFormat("ru-RU");

interface QualitySourceRowProps {
	data: QualitySourceStat;
}

export const QualitySourceRow: FC<QualitySourceRowProps> = ({ data }) => (
	<div className="flex items-center gap-4 py-3 border-b border-[var(--border)] last:border-b-0 flex-wrap">
		<div className="text-sm font-medium text-[var(--text)] font-mono shrink-0 md:min-w-[200px] min-w-0 w-full md:w-auto">
			{data.source}
		</div>
		<div className="flex-1 min-w-0 w-full md:w-auto">
			<div className="h-2 bg-[var(--surface-active)] rounded-full overflow-hidden flex">
				<div
					className="h-full bg-[var(--success)] transition-all"
					style={{ width: `${data.okPct}%` }}
				/>
				<div
					className="h-full bg-[var(--warning)] transition-all"
					style={{ width: `${data.warnPct}%` }}
				/>
				<div
					className="h-full bg-[var(--danger)] transition-all"
					style={{ width: `${data.errPct}%` }}
				/>
			</div>
		</div>
		<div className="flex gap-4 text-xs text-[var(--text-muted)] font-mono shrink-0 min-w-[130px] justify-end w-full md:w-auto md:justify-end">
			<span className="text-[var(--text-secondary)] font-semibold">
				{nf.format(data.total)}
			</span>
			<span className="text-[var(--danger)]">{nf.format(data.err)}</span>
		</div>
	</div>
);
