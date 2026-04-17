import type { Dictionary } from "@/i18n/dictionaries";
import { Typography } from "@/shared/ui";
import { FC } from "react";
import { ApiActions } from "./api-actions";
import { ApiCodeBlock } from "./api-code-block";

interface IApiSectionProps {
	apiSection: Dictionary["apiSection"];
	locale: string;
}

export const ApiSection: FC<IApiSectionProps> = ({ apiSection, locale }) => (
	<section
		aria-labelledby="api-heading"
		className="px-6 pb-20 w-full"
	>
		<div className="max-w-[740px] mx-auto bg-raised border border-edge rounded-xl overflow-hidden relative">
			<div className="px-8 pt-10 pb-6 text-center relative">
				<Typography
					tag="h2"
					id="api-heading"
					className="text-xl font-bold tracking-[-0.02em] text-foreground mb-2"
				>
					{apiSection.title}
				</Typography>
				<p className="text-base text-muted font-light max-w-[400px] mx-auto mb-6">
					{apiSection.description}
				</p>
			</div>
			<ApiCodeBlock codeLines={apiSection.codeLines} />
			<ApiActions actions={apiSection.actions} locale={locale} />
		</div>
	</section>
);
