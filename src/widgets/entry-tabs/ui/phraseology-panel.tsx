import type { Phrase } from "@/entities/dictionary";
import type { FC } from "react";

interface PhraseologyPanelProps {
	items: Phrase[];
	emptyLabel: string;
}

export const PhraseologyPanel: FC<PhraseologyPanelProps> = ({
	items,
	emptyLabel,
}) => {
	if (items.length === 0) {
		return <p className="text-sm text-muted py-4">{emptyLabel}</p>;
	}

	return (
		<div className="border border-edge rounded-lg overflow-hidden">
			{items.map((item, i) => (
				<div
					key={i}
					className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-3 text-sm border-b border-edge last:border-b-0 hover:bg-surface-hover"
				>
					<span className="text-foreground font-medium" lang="ce">
						{item.nah}
						{item.nounClass && (
							<span className="ml-1.5 text-[0.7rem] text-faint font-normal uppercase">
								{item.nounClass}
							</span>
						)}
					</span>
					<span className="text-subtle font-light">
						{item.ru}
						{item.note && (
							<span className="ml-1 text-xs text-faint italic">
								({item.note})
							</span>
						)}
					</span>
				</div>
			))}
		</div>
	);
};
