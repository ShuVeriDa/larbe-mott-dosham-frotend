import type { Derivation, DerivationType } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import Link from "next/link";
import type { FC } from "react";

interface DerivationBannerProps {
	derivation: Derivation;
	lang: string;
	dict: Dictionary["entry"]["derivation"];
}

/**
 * Контекстный баннер «Эта запись — каузатив от **кхоло** „подняться – о тумане"».
 * Рендерится под hero-блоком только если `entry.derivation` присутствует.
 *
 * Если базовая лемма резолвлена (`derivation.from` есть) — рендерим Link на её
 * карточку. Иначе показываем только текстовую цель (`fromText`) с пометкой
 * «(базовая лемма не найдена)».
 */
export const DerivationBanner: FC<DerivationBannerProps> = ({
	derivation,
	lang,
	dict,
}) => {
	const { type, verbFormKind, from, fromText, fromHomonymIndex } = derivation;
	const typeLabel = dict.types[type as DerivationType];
	const tenseLabel = verbFormKind ? dict.verbFormKind[verbFormKind] : null;

	const renderTarget = () => {
		if (from) {
			return (
				<>
					<Link
						href={`/${lang}/entry/${from.id}`}
						className="font-semibold text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
						lang="ce"
					>
						{from.word}
					</Link>
					{from.translation && (
						<span className="text-muted font-light italic ml-1">
							{`„${from.translation}"`}
						</span>
					)}
				</>
			);
		}
		// Нерезолвенная цель — только текст, без ссылки.
		return (
			<>
				<span className="font-semibold text-foreground" lang="ce">
					{fromText}
					{fromHomonymIndex !== undefined && (
						<sup className="text-xs ml-0.5">{fromHomonymIndex}</sup>
					)}
				</span>
				<span className="text-faint text-xs ml-2">{dict.unresolvedNote}</span>
			</>
		);
	};

	return (
		<aside
			role="note"
			aria-label="Derivation reference"
			className="mb-6 px-4 py-3 bg-surface border-l-2 border-primary rounded-r-md text-sm text-subtle leading-relaxed"
		>
			{dict.bannerLabel}{" "}
			<span className="text-foreground">
				{tenseLabel ? `${tenseLabel} ` : ""}
				{typeLabel}
			</span>{" "}
			{dict.fromLabel} {renderTarget()}
		</aside>
	);
};
