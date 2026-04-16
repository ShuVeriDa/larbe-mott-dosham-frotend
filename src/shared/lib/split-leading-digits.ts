export interface SplitLeadingDigits {
	leading: string;
	rest: string;
}

/**
 * Splits a numeric string into leading digits (everything above the last three)
 * and the rest. Used to highlight the "thousands and above" portion of a number
 * in a distinct colour. Numbers with 4 digits or fewer produce an empty `leading`.
 *
 * @example 1234567 -> { leading: "1234", rest: "567" }
 * @example 42      -> { leading: "",     rest: "42"  }
 */
export const splitLeadingDigits = (value: number | string): SplitLeadingDigits => {
	const str = value?.toString() ?? "0";
	const leadingCount = str.length > 4 ? str.length - 3 : 0;

	return {
		leading: str.slice(0, leadingCount),
		rest: str.slice(leadingCount),
	};
};
