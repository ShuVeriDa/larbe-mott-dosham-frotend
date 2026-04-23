"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Toast {
	id: number;
	message: string;
}

export const useToast = (duration = 3000) => {
	const [toast, setToast] = useState<Toast | null>(null);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const show = useCallback(
		(message: string) => {
			if (timerRef.current) clearTimeout(timerRef.current);
			setToast({ id: Date.now(), message });
			timerRef.current = setTimeout(() => setToast(null), duration);
		},
		[duration],
	);

	useEffect(
		() => () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		},
		[],
	);

	return { toast, show };
};
