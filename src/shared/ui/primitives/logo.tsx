import { cn } from "@/shared/lib";
import Link from "next/link";

interface LogoProps {
	variant?: "cyrillic" | "latin";
	size?: "nav" | "compact" | "full";
	className?: string;
	locale?: string;
}

export function Logo({
	variant = "cyrillic",
	size = "nav",
	className,
	locale,
}: LogoProps) {
	const sub = variant === "cyrillic" ? "МОТТ ЛАРБЕ" : "MOTT LARBE";
	const main = variant === "cyrillic" ? "Дошам" : "Dosham";

	return (
		<Link href={`/${locale}`} className={cn("logo", `logo-${size}`, className)}>
			<div className="logo-book">
				<div className="logo-book-body" />
				<div className="logo-book-spine">
					{size === "full" && (
						<>
							<div className="logo-book-spine-line" />
							<div className="logo-book-spine-line" />
						</>
					)}
				</div>
				<div className="logo-book-pages-edge" />
				{/* 12 lines — CSS hides extras per size via nth-child(n+N){display:none} */}
				<div className="logo-book-line" />
				<div className="logo-book-line" />
				<div className="logo-book-line" />
				<div className="logo-book-line" />
				<div className="logo-book-line" />
				<div className="logo-book-line" />
				<div className="logo-book-line" />
				<div className="logo-book-line" />
				<div className="logo-book-line" />
				<div className="logo-book-line" />
				<div className="logo-book-line" />
				<div className="logo-book-line" />
				{size === "full" && <div className="logo-book-bottom" />}
				<div className="logo-bookmark" />
			</div>

			<div className="logo-text">
				<span className="logo-sub">{sub}</span>
				<span className="logo-main">{main}</span>
			</div>
		</Link>
	);
}
