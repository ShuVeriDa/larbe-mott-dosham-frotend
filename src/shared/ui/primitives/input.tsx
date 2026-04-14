import { cn } from "@/shared/lib";
import { ComponentProps } from "react";

export interface InputProps extends Omit<ComponentProps<"input">, "size"> {
	/** Визуальный размер поля */
	size?: "sm" | "default" | "lg";
	/** Состояние ошибки */
	error?: boolean;
}

function Input({
	className,
	size = "default",
	error,
	type,
	...props
}: InputProps) {
	return (
		<input
			type={type}
			data-slot="input"
			data-size={size}
			aria-invalid={error || undefined}
			className={cn(
				// Base
				"w-full border bg-surface text-foreground outline-none",
				"placeholder:text-faint",
				"transition-all duration-fast",
				// Border / focus
				"border-edge hover:not-focus:border-edge-hover",
				"focus:border-primary focus:shadow-focus",
				// Size variants
				size === "sm" && "h-8 rounded-sm px-3 text-sm",
				size === "default" && "h-10 rounded-md px-4 text-base",
				size === "lg" && "h-14 rounded-xl px-5 text-md",
				// Error state
				error &&
					"border-danger shadow-focus-danger hover:border-danger focus:border-danger",
				// Disabled
				"disabled:pointer-events-none disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
