import { Button, Typography } from "@/shared/ui";
import Link from "next/link";
import { FC } from "react";

interface IWordOfDayActionsProps {
	openCard: string;
	nextWord: string;
	entryId?: number;
	lang: string;
	isLoadingNext: boolean;
	onNextWord: () => void;
}

export const WordOfDayActions: FC<IWordOfDayActionsProps> = ({
	openCard,
	nextWord,
	entryId,
	lang,
	isLoadingNext,
	onNextWord,
}) => {
	return (
		<div className="flex gap-3 flex-wrap">
			{entryId ? (
				<Button variant="outline" size="sm" asChild>
					<Link href={`/${lang}/entry/${entryId}`}>
						<Typography tag="span">{openCard}</Typography>
					</Link>
				</Button>
			) : (
				<Button variant="outline" size="sm" disabled>
					<Typography tag="span">{openCard}</Typography>
				</Button>
			)}
			<Button
				variant="ghost"
				size="sm"
				onClick={onNextWord}
				disabled={isLoadingNext}
			>
				<Typography tag="span">
					{isLoadingNext ? "…" : `🎲 ${nextWord}`}
				</Typography>
			</Button>
		</div>
	);
};
