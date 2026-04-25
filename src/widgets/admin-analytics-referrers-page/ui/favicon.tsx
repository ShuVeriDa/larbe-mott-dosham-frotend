"use client";

import { cn } from "@/shared/lib";
import type { FC } from "react";
import { useState } from "react";
import { cleanHost, isDirectKey } from "../lib/categorize";

interface FaviconProps {
	host: string;
	size?: number;
	className?: string;
}

const faviconUrl = (host: string): string =>
	`https://www.google.com/s2/favicons?domain=${encodeURIComponent(
		cleanHost(host),
	)}&sz=32`;

export const Favicon: FC<FaviconProps> = ({ host, size = 20, className }) => {
	const [failed, setFailed] = useState(false);
	const direct = isDirectKey(host);

	const wrapperClass = cn(
		"inline-flex items-center justify-center flex-shrink-0",
		"rounded-[4px] bg-[var(--surface-active)] overflow-hidden",
		"font-mono text-[0.7rem] font-bold text-[var(--text-secondary)]",
		className,
	);
	const style = { width: size, height: size };

	if (direct) {
		return (
			<span aria-hidden="true" className={wrapperClass} style={style}>
				⇣
			</span>
		);
	}

	const cleaned = cleanHost(host);
	const initial = cleaned.charAt(0).toUpperCase() || "?";

	if (failed) {
		return (
			<span aria-hidden="true" className={wrapperClass} style={style}>
				{initial}
			</span>
		);
	}

	return (
		<span className={wrapperClass} style={style}>
			<img
				src={faviconUrl(cleaned)}
				alt=""
				width={size}
				height={size}
				loading="lazy"
				decoding="async"
				className="w-full h-full object-cover"
				onError={() => setFailed(true)}
			/>
		</span>
	);
};
