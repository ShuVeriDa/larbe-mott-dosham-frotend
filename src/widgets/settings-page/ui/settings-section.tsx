import type { FC, ReactNode } from "react";

interface SettingsSectionProps {
	title: string;
	children: ReactNode;
}

export const SettingsSection: FC<SettingsSectionProps> = ({
	title,
	children,
}) => (
	<div>
		<h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-5 pb-2 border-b border-edge">
			{title}
		</h2>
		{children}
	</div>
);
