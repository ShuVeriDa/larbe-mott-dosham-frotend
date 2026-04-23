import type { FC, ReactNode } from "react";

interface SettingsGroupProps {
	title?: string;
	children: ReactNode;
}

export const SettingsGroup: FC<SettingsGroupProps> = ({ title, children }) => (
	<section className="mb-8 last:mb-0">
		{title && (
			<h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
				{title}
			</h3>
		)}
		<div>{children}</div>
	</section>
);
