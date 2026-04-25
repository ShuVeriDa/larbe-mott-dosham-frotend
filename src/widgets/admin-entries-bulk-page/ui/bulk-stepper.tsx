import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";
import type { Step } from "../model";

interface Props {
	current: Step;
	dict: Dictionary["admin"]["entriesBulk"]["steps"];
}

const ORDER: { n: Step; key: keyof Dictionary["admin"]["entriesBulk"]["steps"] }[] = [
	{ n: 1, key: "select" },
	{ n: 2, key: "operation" },
	{ n: 3, key: "preview" },
	{ n: 4, key: "result" },
];

export const BulkStepper: FC<Props> = ({ current, dict }) => (
	<ol
		className="flex items-center gap-2 mb-8 flex-wrap"
		aria-label="Wizard steps"
	>
		{ORDER.map((s, i) => {
			const isActive = current === s.n;
			const isDone = current > s.n;
			return (
				<li key={s.n} className="flex items-center gap-2">
					<div
						className={cn(
							"w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors",
							isActive &&
								"bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-on)]",
							isDone &&
								"bg-[var(--success)] border-[var(--success)] text-white",
							!isActive &&
								!isDone &&
								"border-[var(--border)] text-[var(--text-muted)] bg-transparent",
						)}
						aria-current={isActive ? "step" : undefined}
					>
						{s.n}
					</div>
					<span
						className={cn(
							"text-xs font-medium whitespace-nowrap hidden md:inline",
							isActive && "text-[var(--text)] font-semibold",
							isDone && "text-[var(--success)]",
							!isActive && !isDone && "text-[var(--text-muted)]",
						)}
					>
						{dict[s.key]}
					</span>
					{i < ORDER.length - 1 ? (
						<span
							aria-hidden
							className={cn(
								"h-0.5 w-5 md:w-8 mx-1",
								isDone ? "bg-[var(--success)]" : "bg-[var(--border)]",
							)}
						/>
					) : null}
				</li>
			);
		})}
	</ol>
);
