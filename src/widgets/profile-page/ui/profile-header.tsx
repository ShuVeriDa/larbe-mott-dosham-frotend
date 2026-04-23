"use client";

import { type User, useUploadAvatar } from "@/entities/user";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { isApiError } from "@/shared/api";
import { cn } from "@/shared/lib";
import { Calendar, Mail, Pencil } from "lucide-react";
import Image from "next/image";
import { type FC, useRef } from "react";
import { toast } from "sonner";
import { formatMonthYear } from "../lib/format-date";

interface ProfileHeaderProps {
	user: User;
	initials: string;
	roleLabel: string;
	lang: Locale;
	dict: Dictionary["profile"]["header"];
}

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export const ProfileHeader: FC<ProfileHeaderProps> = ({
	user,
	initials,
	roleLabel,
	lang,
	dict,
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { mutateAsync, isPending } = useUploadAvatar();

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file) return;
		if (file.size > MAX_AVATAR_BYTES) {
			toast.error("≤ 2 MB");
			return;
		}
		try {
			await mutateAsync(file);
		} catch (error) {
			const msg = isApiError(error) ? error.message : null;
			toast.error(msg ?? "Error");
		}
	};

	return (
		<section className="flex items-center gap-6 mb-8 max-sm:flex-col max-sm:text-center max-sm:gap-4">
			<div className="relative shrink-0">
				{user.avatarUrl ? (
					<Image
						src={user.avatarUrl}
						alt={user.name}
						width={80}
						height={80}
						unoptimized
						className="w-20 h-20 rounded-full object-cover border-2 border-edge"
					/>
				) : (
					<div
						aria-hidden
						className="w-20 h-20 rounded-full bg-primary-dim text-primary flex items-center justify-center text-2xl font-bold uppercase border-2 border-edge select-none"
					>
						{initials}
					</div>
				)}

				<button
					type="button"
					title={dict.editAvatar}
					aria-label={dict.editAvatar}
					onClick={() => fileInputRef.current?.click()}
					disabled={isPending}
					className={cn(
						"absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-primary text-primary-foreground",
						"border-2 border-background flex items-center justify-center",
						"transition-transform duration-150 hover:scale-110 disabled:opacity-60",
					)}
				>
					<Pencil size={12} />
				</button>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					className="sr-only"
					onChange={handleFileChange}
				/>
			</div>

			<div className="flex-1 min-w-0">
				<h1 className="text-xl font-bold leading-tight">{user.name}</h1>
				<div className="text-sm text-muted font-mono">@{user.username}</div>
				<div className="flex gap-4 mt-2 flex-wrap max-sm:justify-center">
					<span className="inline-flex items-center px-2 py-0.5 rounded-xs text-xs font-semibold tracking-wide bg-primary-dim text-primary">
						{roleLabel}
					</span>
					<span className="text-xs text-muted inline-flex items-center gap-1">
						<Mail size={12} />
						{user.email}
					</span>
					<span className="text-xs text-muted inline-flex items-center gap-1">
						<Calendar size={12} />
						{dict.registeredSince.replace(
							"{date}",
							formatMonthYear(user.createdAt, lang),
						)}
					</span>
				</div>
			</div>
		</section>
	);
};
