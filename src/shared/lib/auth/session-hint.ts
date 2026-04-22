const KEY = "has-session";

export const markHasSession = (): void => {
	try {
		localStorage.setItem(KEY, "1");
	} catch {}
};

export const clearSessionHint = (): void => {
	try {
		localStorage.removeItem(KEY);
	} catch {}
};

export const hasSessionHint = (): boolean => {
	try {
		return localStorage.getItem(KEY) === "1";
	} catch {
		return false;
	}
};
