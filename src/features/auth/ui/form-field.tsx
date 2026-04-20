import { cn } from "@/shared/lib";
import type { ReactNode } from "react";

interface FormFieldProps {
	htmlFor: string;
	label: ReactNode;
	hint?: ReactNode;
	error?: string | null;
	labelAppend?: ReactNode;
	className?: string;
	children: ReactNode;
}

export const FormField = ({
	htmlFor,
	label,
	hint,
	error,
	labelAppend,
	className,
	children,
}: FormFieldProps) => {
	const messageId = error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined;

	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<div className="flex items-center justify-between gap-2">
				<label
					htmlFor={htmlFor}
					className="text-sm font-medium text-subtle"
				>
					{label}
				</label>
				{labelAppend}
			</div>
			{children}
			{error ? (
				<p id={messageId} className="text-xs text-danger" aria-live="polite">
					{error}
				</p>
			) : hint ? (
				<p id={messageId} className="text-xs text-muted">
					{hint}
				</p>
			) : null}
		</div>
	);
};
