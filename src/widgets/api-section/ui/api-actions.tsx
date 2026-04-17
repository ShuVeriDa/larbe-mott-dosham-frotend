import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "@/shared/ui";
import Link from "next/link";
import { FC } from "react";

interface IApiActionsProps {
	actions: Dictionary["apiSection"]["actions"];
	locale: string;
}

export const ApiActions: FC<IApiActionsProps> = ({ actions, locale }) => (
	<div className="px-8 py-5 border-t border-code-edge flex gap-3 justify-center flex-wrap">
		<Button asChild size="lg">
			<Link href={`/${locale}/search`}>{actions.openDictionary}</Link>
		</Button>
		<Button asChild variant="outline" size="lg">
			<Link href={`/${locale}/about`}>{actions.learnMore}</Link>
		</Button>
	</div>
);
