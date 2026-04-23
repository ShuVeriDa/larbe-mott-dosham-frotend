import { FC } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { Button, Typography } from "@/shared/ui";
import Link from "next/link";

interface IStatsApiHintProps {
	apiHint: Dictionary["stats"]["apiHint"];
	locale: string;
}

export const StatsApiHint: FC<IStatsApiHintProps> = ({ apiHint, locale }) => {
	const [method, ...rest] = apiHint.code.split(" ");
	const path = rest.join(" ");

	return (
		<aside className="max-w-[1020px] w-full mx-auto px-6 pb-16">
			<div className="relative overflow-hidden bg-raised border border-edge rounded-xl p-8 max-[680px]:p-6 flex items-center gap-8 max-[680px]:flex-col max-[680px]:text-center">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -right-[60px] -top-[60px] w-[200px] h-[200px] rounded-full opacity-25"
					style={{
						background:
							"radial-gradient(circle, var(--accent-glow), transparent 70%)",
					}}
				/>
				<div className="relative flex-1">
					<Typography
						tag="h2"
						className="text-base font-bold text-foreground mb-2"
					>
						{apiHint.title}
					</Typography>
					<Typography tag="p" className="text-sm text-muted font-light mb-4">
						{apiHint.description}
					</Typography>
					<div className="inline-block font-mono text-xs text-subtle bg-code border border-code-edge rounded-md px-4 py-3">
						<span className="text-primary">{method}</span>{" "}
						<span className="text-muted">{path}</span>
					</div>
				</div>
				<div className="relative flex-shrink-0">
					<Button asChild variant="outline" size="md">
						<Link href={`/${locale}/about#api`}>{apiHint.cta}</Link>
					</Button>
				</div>
			</div>
		</aside>
	);
};
