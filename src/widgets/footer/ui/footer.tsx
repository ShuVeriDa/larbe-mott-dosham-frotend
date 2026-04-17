import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Logo } from "@/shared/ui/primitives/logo";
import { FC } from "react";
import { FooterCopy } from "./footer-copy";

interface FooterProps {
	footer: Dictionary["footer"];
	locale: Locale;
}

export const Footer: FC<FooterProps> = ({ footer, locale }) => (
	<section className="border-t border-edge pt-10 px-6 pb-8">
		<div className="max-w-[1020px] mx-auto flex flex-col sm:flex-row justify-between items-center flex-wrap gap-4">
			<div>
				<Logo variant="cyrillic" size="nav" locale={locale} />
				<FooterCopy copy={footer.copy} />
			</div>
		</div>
	</section>
);
