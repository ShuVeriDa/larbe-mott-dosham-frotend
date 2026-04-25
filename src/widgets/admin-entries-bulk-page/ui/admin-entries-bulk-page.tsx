"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { Breadcrumb, PageHeader } from "@/shared/ui/admin";
import type { FC } from "react";
import { useBulkWizard } from "../model";
import { BulkJsonLd } from "./bulk-json-ld";
import { BulkStepOperation } from "./bulk-step-operation";
import { BulkStepPreview } from "./bulk-step-preview";
import { BulkStepResult } from "./bulk-step-result";
import { BulkStepSelect } from "./bulk-step-select";
import { BulkStepper } from "./bulk-stepper";

interface AdminEntriesBulkPageProps {
	lang: Locale;
	dict: Dictionary["admin"]["entriesBulk"];
	entriesDict: Dictionary["admin"]["entries"];
	commonDict: Dictionary["admin"]["common"];
}

export const AdminEntriesBulkPage: FC<AdminEntriesBulkPageProps> = ({
	lang,
	dict,
	entriesDict,
}) => {
	const wizard = useBulkWizard({ dict });

	return (
		<main className="max-w-[1100px] mx-auto">
			<BulkJsonLd lang={lang} dict={dict} />

			<Breadcrumb
				items={[
					{
						label: entriesDict.header.title,
						href: `/${lang}/admin/entries`,
					},
					{ label: dict.header.title },
				]}
			/>

			<PageHeader title={dict.header.title} subtitle={dict.header.subtitle} />

			<BulkStepper current={wizard.step} dict={dict.steps} />

			{wizard.step === 1 ? (
				<BulkStepSelect wizard={wizard} lang={lang} dict={dict} />
			) : null}
			{wizard.step === 2 ? (
				<BulkStepOperation wizard={wizard} dict={dict} />
			) : null}
			{wizard.step === 3 ? (
				<BulkStepPreview wizard={wizard} dict={dict} />
			) : null}
			{wizard.step === 4 ? (
				<BulkStepResult wizard={wizard} lang={lang} dict={dict} />
			) : null}
		</main>
	);
};
