"use client";

import { cn } from "@/shared/lib";
import {
	type FC,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";

type ValidState =
	| { valid: true; itemsCount?: number; keysCount?: number }
	| { valid: false; message: string };

interface JsonEditorLabels {
	format: string;
	validate: string;
	copy?: string;
	copied?: string;
	valid: string;
	invalid: string;
	itemsCount?: string;
	keysCount?: string;
	errorPrefix: string;
}

interface JsonEditorProps {
	value: string;
	onChange: (next: string) => void;
	onValidityChange?: (valid: boolean) => void;
	minHeight?: number;
	labels: JsonEditorLabels;
	showCopy?: boolean;
	extraToolbar?: ReactNode;
	className?: string;
	ariaLabel?: string;
}

const validateJson = (raw: string): ValidState => {
	try {
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed))
			return { valid: true, itemsCount: parsed.length };
		if (parsed && typeof parsed === "object")
			return { valid: true, keysCount: Object.keys(parsed).length };
		return { valid: true };
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return { valid: false, message };
	}
};

const formatRaw = (raw: string): string | null => {
	try {
		return JSON.stringify(JSON.parse(raw), null, 2);
	} catch {
		return null;
	}
};

const interpolate = (template: string, vars: Record<string, string | number>) =>
	template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));

export const JsonEditor: FC<JsonEditorProps> = ({
	value,
	onChange,
	onValidityChange,
	minHeight = 200,
	labels,
	showCopy = false,
	extraToolbar,
	className,
	ariaLabel,
}) => {
	const state = useMemo(() => validateJson(value), [value]);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		onValidityChange?.(state.valid);
	}, [onValidityChange, state.valid]);

	const onFormat = useCallback(() => {
		const next = formatRaw(value);
		if (next !== null) onChange(next);
	}, [onChange, value]);

	const onCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {
			// ignore — clipboard may be unavailable
		}
	}, [value]);

	let statusText = labels.valid;
	if (state.valid) {
		if (state.itemsCount !== undefined && labels.itemsCount) {
			statusText = interpolate(labels.itemsCount, { count: state.itemsCount });
		} else if (state.keysCount !== undefined && labels.keysCount) {
			statusText = interpolate(labels.keysCount, { count: state.keysCount });
		}
	} else {
		statusText = `${labels.errorPrefix} ${state.message.slice(0, 80)}`;
	}

	return (
		<div
			className={cn(
				"relative border border-[var(--border)] rounded-md overflow-hidden bg-[var(--bg)]",
				className,
			)}
		>
			<div className="flex items-center gap-2 px-3 py-2 bg-[var(--surface)] border-b border-[var(--border)] flex-wrap">
				<button
					type="button"
					onClick={onFormat}
					className="btn btn-sm btn-secondary"
				>
					{labels.format}
				</button>
				<button
					type="button"
					onClick={() => onValidityChange?.(state.valid)}
					className="btn btn-sm btn-secondary"
				>
					{labels.validate}
				</button>
				{showCopy && labels.copy ? (
					<button
						type="button"
						onClick={onCopy}
						className="btn btn-sm btn-secondary"
					>
						{copied && labels.copied ? labels.copied : labels.copy}
					</button>
				) : null}
				{extraToolbar}
			</div>
			<textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				spellCheck={false}
				aria-label={ariaLabel}
				style={{ minHeight }}
				className={cn(
					"font-mono text-xs leading-[1.7] w-full px-4 py-3",
					"bg-[var(--bg)] text-[var(--text-secondary)]",
					"border-none outline-none resize-y",
				)}
			/>
			<div
				className={cn(
					"flex items-center gap-2 px-3 py-1 text-[11px] border-t border-[var(--border)] bg-[var(--surface)]",
					state.valid
						? "text-[var(--success)]"
						: "text-[var(--danger)]",
				)}
			>
				<span
					className={cn(
						"w-1.5 h-1.5 rounded-full",
						state.valid ? "bg-[var(--success)]" : "bg-[var(--danger)]",
					)}
				/>
				<span>{statusText}</span>
			</div>
		</div>
	);
};

export type { JsonEditorLabels };
