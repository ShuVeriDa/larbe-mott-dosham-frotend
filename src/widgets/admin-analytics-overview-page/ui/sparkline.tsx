import type { FC } from "react";

interface SparklineProps {
	values: number[];
	stroke?: string;
	width?: number;
	height?: number;
	className?: string;
}

const buildPoints = (
	values: number[],
	width: number,
	height: number,
): string => {
	if (values.length === 0) return "";
	if (values.length === 1) {
		const y = height / 2;
		return `0,${y} ${width},${y}`;
	}
	const min = Math.min(...values);
	const max = Math.max(...values);
	const range = max - min || 1;
	const stepX = width / (values.length - 1);
	return values
		.map((v, i) => {
			const x = (i * stepX).toFixed(2);
			const y = (height - ((v - min) / range) * height).toFixed(2);
			return `${x},${y}`;
		})
		.join(" ");
};

export const Sparkline: FC<SparklineProps> = ({
	values,
	stroke = "var(--accent)",
	width = 60,
	height = 24,
	className,
}) => {
	if (values.length === 0) return null;
	return (
		<svg
			className={className}
			viewBox={`0 0 ${width} ${height}`}
			preserveAspectRatio="none"
			aria-hidden="true"
			focusable="false"
		>
			<polyline
				fill="none"
				stroke={stroke}
				strokeWidth={1.5}
				strokeLinejoin="round"
				strokeLinecap="round"
				points={buildPoints(values, width, height)}
			/>
		</svg>
	);
};
