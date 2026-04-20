"use client";

import { Input, type InputProps } from "@/shared/ui";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordInputProps extends Omit<InputProps, "type"> {
	showLabel: string;
	hideLabel: string;
}

export const PasswordInput = ({
	showLabel,
	hideLabel,
	className,
	...inputProps
}: PasswordInputProps) => {
	const [visible, setVisible] = useState(false);

	return (
		<div className="relative">
			<Input
				{...inputProps}
				type={visible ? "text" : "password"}
				className="pr-11"
			/>
			<button
				type="button"
				tabIndex={-1}
				onClick={() => setVisible(v => !v)}
				aria-label={visible ? hideLabel : showLabel}
				className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted transition-colors hover:text-foreground"
			>
				{visible ? <EyeOff size={18} /> : <Eye size={18} />}
			</button>
		</div>
	);
};
