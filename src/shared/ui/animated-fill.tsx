"use client";

import { CSSProperties, FC, useEffect, useState } from "react";
import { cn } from "@/shared/lib";

interface IAnimatedFillProps {
	/** Target width in percent (0–100). */
	percent: number;
	className?: string;
	style?: CSSProperties;
	children?: React.ReactNode;
	durationMs?: number;
}

export const AnimatedFill: FC<IAnimatedFillProps> = ({
	percent,
	className,
	style,
	children,
	durationMs = 1000,
}) => {
	const [width, setWidth] = useState(0);

	useEffect(() => {
		const id = requestAnimationFrame(() =>
			setWidth(Math.max(0, Math.min(100, percent))),
		);
		return () => cancelAnimationFrame(id);
	}, [percent]);

	return (
		<div
			className={cn("h-full", className)}
			style={{
				width: `${width}%`,
				transition: `width ${durationMs}ms cubic-bezier(.16,1,.3,1)`,
				...style,
			}}
		>
			{children}
		</div>
	);
};
