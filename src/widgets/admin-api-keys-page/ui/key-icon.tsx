import { cn } from "@/shared/lib";
import { KeyRoundIcon } from "lucide-react";
import type { FC } from "react";
import { iconToneClass } from "../lib/format";

interface KeyIconProps {
	seed: string | number;
	size?: "sm" | "md";
	className?: string;
}

export const KeyIcon: FC<KeyIconProps> = ({ seed, size = "sm", className }) => (
	<div
		className={cn(
			"rounded-md flex items-center justify-center flex-shrink-0",
			size === "sm" ? "w-[34px] h-[34px]" : "w-10 h-10",
			iconToneClass(seed),
			className,
		)}
		aria-hidden
	>
		<KeyRoundIcon className={size === "sm" ? "size-4" : "size-[18px]"} />
	</div>
);
