"use client";

import { cn } from "@/shared/lib";
import { useTheme } from "next-themes";
import type { FC } from "react";
import { useEffect, useState } from "react";

interface AdminThemeSwitcherProps {
	darkLabel: string;
	lightLabel: string;
}

export const AdminThemeSwitcher: FC<AdminThemeSwitcherProps> = ({
	darkLabel,
	lightLabel,
}) => {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const isDark = mounted ? resolvedTheme !== "light" : true;

	return (
		<div className="flex items-center bg-[var(--surface)] border border-[var(--border)] rounded-full p-[2px] gap-[2px]">
			<button
				type="button"
				onClick={() => setTheme("dark")}
				aria-label={darkLabel}
				aria-pressed={isDark}
				className={cn(
					"w-7 h-7 rounded-full border-none bg-transparent text-[var(--text-muted)] flex items-center justify-center text-[0.8rem]",
					isDark && "bg-[var(--accent)] text-[var(--accent-on)]",
				)}
			>
				🌙
			</button>
			<button
				type="button"
				onClick={() => setTheme("light")}
				aria-label={lightLabel}
				aria-pressed={!isDark}
				className={cn(
					"w-7 h-7 rounded-full border-none bg-transparent text-[var(--text-muted)] flex items-center justify-center text-[0.8rem]",
					!isDark && "bg-[var(--accent)] text-[var(--accent-on)]",
				)}
			>
				☀️
			</button>
		</div>
	);
};
