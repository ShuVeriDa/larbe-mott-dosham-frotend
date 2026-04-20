"use client";

import { cn } from "@/shared/lib";
import Link from "next/link";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import type {
	ComponentPropsWithoutRef,
	ElementRef,
	FC,
	ReactNode,
} from "react";
import { forwardRef } from "react";

type Variant = "default" | "accent" | "danger";

type BaseProps = {
	icon: ReactNode;
	label: string;
	badge?: ReactNode;
	shortcut?: string;
	variant?: Variant;
	className?: string;
};

const rowClasses =
	"group/ud-item flex items-center gap-3 w-full px-4 py-2 text-sm bg-transparent border-none text-left cursor-pointer transition-colors duration-150 hover:bg-surface focus-visible:bg-surface focus-visible:outline-none outline-hidden";

const variantClasses: Record<Variant, string> = {
	default: "text-subtle hover:text-foreground",
	accent: "text-primary hover:text-primary",
	danger: "text-danger hover:bg-danger-dim hover:text-danger",
};

const iconClasses: Record<Variant, string> = {
	default: "text-muted group-hover/ud-item:text-primary",
	accent: "text-primary",
	danger: "text-danger group-hover/ud-item:text-danger",
};

const renderInner = (
	icon: ReactNode,
	label: string,
	badge: ReactNode,
	shortcut: string | undefined,
	variant: Variant,
) => (
	<>
		<span
			className={cn(
				"w-5 h-5 shrink-0 flex items-center justify-center transition-colors [&_svg]:w-4 [&_svg]:h-4",
				iconClasses[variant],
			)}
		>
			{icon}
		</span>
		<span className="flex-1 leading-tight">{label}</span>
		{badge}
		{shortcut && (
			<span className="font-mono text-[0.65rem] text-faint px-1.5 py-0.5 border border-edge rounded-xs bg-surface">
				{shortcut}
			</span>
		)}
	</>
);

interface UserDropdownLinkProps
	extends BaseProps,
		Omit<ComponentPropsWithoutRef<typeof Link>, keyof BaseProps> {
	href: string;
}

export const UserDropdownLink = forwardRef<
	ElementRef<typeof Link>,
	UserDropdownLinkProps
>(
	(
		{
			icon,
			label,
			badge,
			shortcut,
			variant = "default",
			href,
			className,
			...rest
		},
		ref,
	) => (
		<DropdownMenuPrimitive.Item asChild>
			<Link
				ref={ref}
				href={href}
				role="menuitem"
				className={cn(rowClasses, variantClasses[variant], className)}
				{...rest}
			>
				{renderInner(icon, label, badge, shortcut, variant)}
			</Link>
		</DropdownMenuPrimitive.Item>
	),
);
UserDropdownLink.displayName = "UserDropdownLink";

interface UserDropdownButtonProps
	extends BaseProps,
		Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> {}

export const UserDropdownButton = forwardRef<
	HTMLButtonElement,
	UserDropdownButtonProps
>(
	(
		{ icon, label, badge, shortcut, variant = "default", className, ...rest },
		ref,
	) => (
		<DropdownMenuPrimitive.Item asChild>
			<button
				ref={ref}
				type="button"
				role="menuitem"
				className={cn(rowClasses, variantClasses[variant], className)}
				{...rest}
			>
				{renderInner(icon, label, badge, shortcut, variant)}
			</button>
		</DropdownMenuPrimitive.Item>
	),
);
UserDropdownButton.displayName = "UserDropdownButton";

interface UserDropdownBadgeProps {
	children: ReactNode;
	variant?: "default" | "pending";
}

export const UserDropdownBadge: FC<UserDropdownBadgeProps> = ({
	children,
	variant = "default",
}) => (
	<span
		className={cn(
			"inline-flex items-center justify-center min-w-5 h-[18px] px-1.5 rounded-full font-mono text-[0.65rem] font-semibold leading-none",
			variant === "pending"
				? "bg-warning-dim text-warning"
				: "bg-primary-dim text-primary",
		)}
	>
		{children}
	</span>
);
