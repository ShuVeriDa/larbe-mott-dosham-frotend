"use client";

import { useTheme } from "next-themes";

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	return (
		<div className="theme-switcher">
			<button
				className={`theme-opt${theme === "dark" ? " active" : ""}`}
				onClick={() => setTheme("dark")}
				aria-label="Тёмная тема"
			>
				🌙
			</button>
			<button
				className={`theme-opt${theme === "light" ? " active" : ""}`}
				onClick={() => setTheme("light")}
				aria-label="Светлая тема"
			>
				☀️
			</button>
		</div>
	);
}
