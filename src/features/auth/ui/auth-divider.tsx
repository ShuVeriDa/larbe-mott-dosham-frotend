interface AuthDividerProps {
	label: string;
}

export const AuthDivider = ({ label }: AuthDividerProps) => (
	<div
		role="separator"
		aria-orientation="horizontal"
		className="my-2 flex items-center gap-4"
	>
		<span className="h-px flex-1 bg-edge" />
		<span className="text-xs uppercase tracking-[0.06em] font-medium text-faint">
			{label}
		</span>
		<span className="h-px flex-1 bg-edge" />
	</div>
);
