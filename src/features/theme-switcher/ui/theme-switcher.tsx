"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="theme-switcher">
			<button
				className={`theme-opt${mounted && theme === "dark" ? " active" : ""}`}
				onClick={() => setTheme("dark")}
				aria-label="Тёмная тема"
			>
				🌙
			</button>
			<button
				className={`theme-opt${mounted && theme === "light" ? " active" : ""}`}
				onClick={() => setTheme("light")}
				aria-label="Светлая тема"
			>
				☀️
			</button>
		</div>
	);
}
