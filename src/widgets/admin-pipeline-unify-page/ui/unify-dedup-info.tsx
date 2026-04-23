import type { Dictionary } from "@/i18n/dictionaries";
import type { FC } from "react";

interface Props {
	dict: Dictionary["admin"]["pipelineUnify"];
}

const KEY_PARTS = ["word", "homonymIndex", "nounClass"];

export const UnifyDedupInfo: FC<Props> = ({ dict }) => {
	const [before, after] = dict.dedup.desc.split("{keys}");
	return (
		<section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 mb-8">
			<h2 className="text-sm font-semibold text-[var(--text)] mb-2">
				{dict.dedup.title}
			</h2>
			<p className="text-xs text-[var(--text-muted)] leading-relaxed">
				{before}
				{KEY_PARTS.map((key, i) => (
					<span key={key}>
						{i > 0 ? " + " : ""}
						<code className="inline-block font-mono text-xs bg-[var(--surface-active)] px-1.5 py-0.5 rounded text-[var(--accent)]">
							{key}
						</code>
					</span>
				))}
				{after}
			</p>
		</section>
	);
};
