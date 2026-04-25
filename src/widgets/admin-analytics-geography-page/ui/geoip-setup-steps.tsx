import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC, ReactNode } from "react";

interface GeoIpSetupStepsProps {
	dict: Dictionary["admin"]["analytics"]["geography"]["setup"];
}

const InlineCode: FC<{ children: ReactNode }> = ({ children }) => (
	<code className="font-mono text-[0.85em] bg-[var(--surface-active)] px-[6px] py-[1px] rounded-sm">
		{children}
	</code>
);

const renderTemplate = (
	template: string,
	tokens: Record<string, ReactNode>,
): ReactNode[] => {
	const parts = template.split(/\{(\w+)\}/g);
	return parts.map((part, idx) => {
		if (idx % 2 === 1) {
			return <span key={idx}>{tokens[part] ?? `{${part}}`}</span>;
		}
		return <span key={idx}>{part}</span>;
	});
};

const StepBlock: FC<{
	num: number;
	title: string;
	desc: ReactNode;
	code?: string;
}> = ({ num, title, desc, code }) => (
	<li
		className={cn(
			"grid items-start gap-3 p-3 rounded-md",
			"grid-cols-[28px_1fr]",
			"bg-[var(--bg-raised)] border border-[var(--border)]",
		)}
	>
		<span
			aria-hidden="true"
			className={cn(
				"w-7 h-7 rounded-full flex items-center justify-center shrink-0",
				"bg-[var(--accent-dim)] text-[var(--accent)] text-xs font-bold tabular-nums",
			)}
		>
			{num}
		</span>
		<div className="min-w-0">
			<div className="text-sm font-semibold text-[var(--text)] mb-1">
				{title}
			</div>
			<div className="text-xs text-[var(--text-muted)] leading-relaxed">
				{desc}
			</div>
			{code ? (
				<code
					className={cn(
						"block mt-2 px-3 py-2 rounded-sm overflow-x-auto whitespace-nowrap",
						"bg-[var(--bg)] border border-[var(--border)]",
						"font-mono text-xs text-[var(--text-secondary)]",
					)}
				>
					{code}
				</code>
			) : null}
		</div>
	</li>
);

export const GeoIpSetupSteps: FC<GeoIpSetupStepsProps> = ({ dict }) => {
	const linkTokens = {
		link: (
			<a
				href="https://www.maxmind.com"
				target="_blank"
				rel="noopener noreferrer"
				className="text-[var(--accent)] font-medium hover:underline"
			>
				maxmind.com
			</a>
		),
	};

	return (
		<section
			id="geoip-setup"
			className={cn(
				"bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 mb-6",
				"scroll-mt-24",
			)}
		>
			<h2 className="text-base font-semibold text-[var(--text)] mb-4">
				{dict.title}
			</h2>
			<ol className="flex flex-col gap-3">
				<StepBlock
					num={1}
					title={dict.steps["1"].title}
					desc={renderTemplate(dict.steps["1"].desc, linkTokens)}
				/>
				<StepBlock
					num={2}
					title={dict.steps["2"].title}
					desc={renderTemplate(dict.steps["2"].desc, {
						path: <InlineCode>/data/geoip/</InlineCode>,
					})}
				/>
				<StepBlock
					num={3}
					title={dict.steps["3"].title}
					desc={dict.steps["3"].desc}
					code="npm i maxmind"
				/>
				<StepBlock
					num={4}
					title={dict.steps["4"].title}
					desc={renderTemplate(dict.steps["4"].desc, {
						file: <InlineCode>src/analytics/analytics.service.ts</InlineCode>,
						fn: <InlineCode>track()</InlineCode>,
					})}
					code="const country = await this.geoip.lookup(ip);"
				/>
				<StepBlock
					num={5}
					title={dict.steps["5"].title}
					desc={renderTemplate(dict.steps["5"].desc, {
						field: <InlineCode>country</InlineCode>,
					})}
				/>
			</ol>
		</section>
	);
};
