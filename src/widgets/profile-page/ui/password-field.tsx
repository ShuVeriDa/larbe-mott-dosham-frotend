"use client";

import { cn } from "@/shared/lib";
import { Input } from "@/shared/ui";
import { Eye, EyeOff } from "lucide-react";
import { type FC, useState } from "react";

interface PasswordFieldProps {
	id: string;
	value: string;
	placeholder?: string;
	disabled?: boolean;
	autoComplete?: string;
	showLabel: string;
	hideLabel: string;
	error?: string;
	onChange: (value: string) => void;
}

export const PasswordField: FC<PasswordFieldProps> = ({
	id,
	value,
	placeholder,
	disabled,
	autoComplete,
	showLabel,
	hideLabel,
	error,
	onChange,
}) => {
	const [visible, setVisible] = useState(false);

	return (
		<div className={cn("relative")}>
			<Input
				id={id}
				type={visible ? "text" : "password"}
				value={value}
				placeholder={placeholder}
				disabled={disabled}
				autoComplete={autoComplete}
				error={!!error}
				onChange={e => onChange(e.target.value)}
				className="pr-11"
			/>
			<button
				type="button"
				tabIndex={-1}
				aria-label={visible ? hideLabel : showLabel}
				onClick={() => setVisible(v => !v)}
				className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted transition-colors hover:text-foreground"
			>
				{visible ? <EyeOff size={18} /> : <Eye size={18} />}
			</button>
		</div>
	);
};
