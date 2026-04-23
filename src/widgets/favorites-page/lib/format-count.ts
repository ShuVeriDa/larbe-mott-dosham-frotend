import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { toIntlLocale } from "./intl-locale";

type CountDict = Pick<
	Dictionary["favoritesPage"]["header"],
	"countOne" | "countFew" | "countMany"
>;

export const formatCount = (
	count: number,
	dict: CountDict,
	lang: Locale,
): string => {
	const rule = new Intl.PluralRules(toIntlLocale(lang)).select(count);
	const template =
		rule === "one"
			? dict.countOne
			: rule === "few"
				? dict.countFew
				: dict.countMany;
	return template.replace("{count}", String(count));
};
