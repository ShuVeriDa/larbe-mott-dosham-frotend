import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC, ReactNode } from "react";

interface GeoIpSetupNoticeProps {
	dict: Dictionary["admin"]["analytics"]["geography"]["notice"];
}

const InlineCode: FC<{ children: ReactNode }> = ({ children }) => (
	<code className="font-mono text-[0.85em] bg-[var(--surface-active)] px-[6px] py-[1px] rounded-sm">
		{children}
	</code>
);

const renderText = (
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

export const GeoIpSetupNotice: FC<GeoIpSetupNoticeProps> = ({ dict }) => {
	const tokens: Record<string, ReactNode> = {
		endpoint: <InlineCode>/api/admin/analytics/top-countries</InlineCode>,
		field: <InlineCode>country</InlineCode>,
	};

	return (
		<div
			className={cn(
				"mb-6 rounded-2xl p-6 flex flex-col md:flex-row gap-5 items-start",
				"border border-[var(--warning)]",
				"bg-gradient-to-br from-[var(--warning-dim)] to-transparent",
			)}
		>
			<div
				aria-hidden="true"
				className={cn(
					"shrink-0 w-12 h-12 rounded-md flex items-center justify-center",
					"bg-[var(--warning)] text-black text-2xl",
				)}
			>
				🗺️
			</div>
			<div className="flex-1 min-w-0">
				<div className="text-base font-semibold text-[var(--text)] mb-2">
					{dict.title}
				</div>
				<p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
					{renderText(dict.text, tokens)}
				</p>
				<div className="flex flex-wrap gap-2">
					<a
						href="https://www.maxmind.com/en/geolite2/signup"
						target="_blank"
						rel="noopener noreferrer"
						className={cn(
							"inline-flex items-center justify-center gap-2 px-3 h-8 rounded-md",
							"bg-[var(--accent)] text-[var(--accent-on)] text-xs font-semibold",
							"hover:opacity-90 transition-opacity",
						)}
					>
						{dict.register}
					</a>
					<a
						href="#geoip-setup"
						className={cn(
							"inline-flex items-center justify-center gap-2 px-3 h-8 rounded-md",
							"bg-[var(--surface)] border border-[var(--border)]",
							"text-xs font-semibold text-[var(--text)]",
							"hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] transition-colors",
						)}
					>
						{dict.setupAnchor}
					</a>
				</div>
			</div>
		</div>
	);
};
