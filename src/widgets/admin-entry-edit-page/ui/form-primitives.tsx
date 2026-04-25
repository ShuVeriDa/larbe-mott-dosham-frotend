"use client";

import { cn } from "@/shared/lib";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui";
import type {
	FC,
	InputHTMLAttributes,
	ReactNode,
} from "react";

const ALL = "__none__";

interface FieldProps {
	label: ReactNode;
	hint?: ReactNode;
	optional?: ReactNode;
	required?: boolean;
	children: ReactNode;
	full?: boolean;
}

export const Field: FC<FieldProps> = ({
	label,
	hint,
	optional,
	required,
	children,
	full,
}) => (
	<div className={cn("flex flex-col gap-2", full && "md:col-span-full")}>
		<label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
			<span>{label}</span>
			{required ? (
				<span className="text-[var(--danger)] font-bold">*</span>
			) : null}
			{optional ? (
				<span className="text-[var(--text-faint)] font-normal normal-case tracking-normal text-xs">
					{optional}
				</span>
			) : null}
		</label>
		{children}
		{hint ? (
			<div className="text-xs text-[var(--text-faint)]">{hint}</div>
		) : null}
	</div>
);

export const FormGrid: FC<{
	cols?: 2 | 3;
	children: ReactNode;
	className?: string;
}> = ({ cols = 2, children, className }) => (
	<div
		className={cn(
			"grid gap-4",
			cols === 2
				? "grid-cols-1 md:grid-cols-2"
				: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
			className,
		)}
	>
		{children}
	</div>
);

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
	value?: string | number;
}

export const TextInput: FC<TextInputProps> = ({ className, ...rest }) => (
	<input
		{...rest}
		className={cn(
			"px-3 py-2 h-[38px] bg-[var(--surface)] border border-[var(--border)] rounded-md",
			"text-sm text-[var(--text)] placeholder:text-[var(--text-faint)]",
			"outline-none transition-colors",
			"focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-dim)]",
			"read-only:opacity-60 read-only:cursor-not-allowed",
			className,
		)}
	/>
);

interface SelectOption {
	value: string;
	label: string;
}

interface SelectFieldProps {
	value: string | null | undefined;
	onChange: (value: string) => void;
	options: SelectOption[];
	placeholder?: string;
	className?: string;
	disabled?: boolean;
	"aria-label"?: string;
}

export const SelectField: FC<SelectFieldProps> = ({
	value,
	onChange,
	options,
	placeholder,
	className,
	disabled,
	"aria-label": ariaLabel,
}) => {
	const current = value ?? "";
	const selectValue = current === "" ? ALL : current;
	return (
		<Select
			value={selectValue}
			onValueChange={(next) => onChange(next === ALL ? "" : next)}
			disabled={disabled}
		>
			<SelectTrigger
				className={cn("h-[38px] w-full", className)}
				aria-label={ariaLabel}
			>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{placeholder ? (
					<SelectItem value={ALL}>{placeholder}</SelectItem>
				) : null}
				{options.map((opt) => (
					<SelectItem key={opt.value} value={opt.value}>
						{opt.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

interface CardProps {
	title: ReactNode;
	icon?: string;
	description?: ReactNode;
	actions?: ReactNode;
	children: ReactNode;
	className?: string;
}

export const EditorCard: FC<CardProps> = ({
	title,
	icon,
	description,
	actions,
	children,
	className,
}) => (
	<section
		className={cn(
			"bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 mb-4",
			className,
		)}
	>
		<header className="flex items-center justify-between gap-3 mb-4 flex-wrap">
			<div>
				<h2 className="text-base font-semibold text-[var(--text)] flex items-center gap-2">
					{icon ? <span aria-hidden>{icon}</span> : null}
					<span>{title}</span>
				</h2>
				{description ? (
					<p className="text-xs text-[var(--text-muted)] mt-1">
						{description}
					</p>
				) : null}
			</div>
			{actions}
		</header>
		{children}
	</section>
);

interface ModeToggleProps<T extends string> {
	mode: T;
	onChange: (mode: T) => void;
	options: { value: T; label: string }[];
}

export const ModeToggle = <T extends string>({
	mode,
	onChange,
	options,
}: ModeToggleProps<T>) => (
	<div className="inline-flex items-center bg-[var(--surface)] border border-[var(--border)] rounded-full p-[3px] gap-[2px]">
		{options.map((opt) => {
			const isActive = opt.value === mode;
			return (
				<button
					key={opt.value}
					type="button"
					onClick={() => onChange(opt.value)}
					className={cn(
						"px-3 py-1 rounded-full text-xs font-medium transition-colors",
						isActive
							? "bg-[var(--accent)] text-[var(--accent-on)]"
							: "text-[var(--text-muted)] hover:text-[var(--text)]",
					)}
				>
					{opt.label}
				</button>
			);
		})}
	</div>
);
