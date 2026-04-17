const CYRILLIC_LETTER = /[а-яёА-ЯЁ]/;
// Кириллическая палочка — U+04C0 (Ӏ). U+04C1 это совсем другая буква (Ӂ).
const CYRILLIC_PALOCHKA_UPPER = "\u04c0";

/**
 * Replaces the digit `1` with the Cyrillic palochka `Ӏ` (U+04C1) when it is
 * adjacent to a Cyrillic letter. This lets users type Chechen words on a
 * layout without the palochka key (e.g. `ц1а` → `цӀа`) while leaving
 * numeric queries like `2026` untouched.
 */
export const fixPalochka = (input: string): string => {
	if (!input.includes("1")) return input;

	let result = "";
	for (let i = 0; i < input.length; i++) {
		const ch = input[i];
		if (ch !== "1") {
			result += ch;
			continue;
		}
		const prev = input[i - 1];
		const next = input[i + 1];
		const adjacentToCyrillic =
			(prev && CYRILLIC_LETTER.test(prev)) ||
			(next && CYRILLIC_LETTER.test(next));
		result += adjacentToCyrillic ? CYRILLIC_PALOCHKA_UPPER : ch;
	}
	return result;
};
