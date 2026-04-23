"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { isApiError } from "@/shared/api";
import type { FC } from "react";
import { useAdminSuggestionDetail } from "../model/use-admin-suggestion-detail";
import { AdjacentNav } from "./adjacent-nav";
import { DetailBreadcrumb } from "./detail-breadcrumb";
import { DetailHeader } from "./detail-header";
import { DetailSkeleton } from "./detail-skeleton";
import {
	ErrorState,
	Forbidden,
	LoginRequired,
	NotFoundState,
} from "./detail-states";
import { DiffCard } from "./diff-card";
import { EntryPreviewCard } from "./entry-preview-card";
import { InfoCard } from "./info-card";
import { QuickActionsCard } from "./quick-actions-card";

interface AdminSuggestionDetailPageProps {
	id: string;
	lang: Locale;
	dict: Dictionary["adminSuggestionDetail"];
}

export const AdminSuggestionDetailPage: FC<AdminSuggestionDetailPageProps> = ({
	id,
	lang,
	dict,
}) => {
	const {
		isAuthenticated,
		canReview,
		authReady,
		suggestion,
		isLoading,
		isError,
		error,
		refetch,
		adjacent,
		entry,
		entryLoading,
		entryError,
		reviewComment,
		setReviewComment,
		confirmAction,
		openConfirm,
		closeConfirm,
		submitReview,
		isReviewing,
	} = useAdminSuggestionDetail({ id, lang, dict });

	const containerClass =
		"max-w-[900px] w-full mx-auto px-4 sm:px-6 pt-6 pb-20";

	if (!isAuthenticated) {
		return (
			<section className={containerClass}>
				<LoginRequired dict={dict.states} lang={lang} id={id} />
			</section>
		);
	}

	if (!canReview) {
		return (
			<section className={containerClass}>
				<Forbidden dict={dict.states} />
			</section>
		);
	}

	if (!authReady || isLoading) {
		return (
			<section className={containerClass}>
				<DetailSkeleton />
			</section>
		);
	}

	if (isError) {
		const notFound = isApiError(error) && error.statusCode === 404;
		return (
			<section className={containerClass}>
				{notFound ? (
					<NotFoundState dict={dict.states} lang={lang} />
				) : (
					<ErrorState dict={dict.states} onRetry={() => refetch()} />
				)}
			</section>
		);
	}

	if (!suggestion) {
		return (
			<section className={containerClass}>
				<NotFoundState dict={dict.states} lang={lang} />
			</section>
		);
	}

	const entryId = suggestion.entry?.id ?? suggestion.entryId;

	return (
		<section className={containerClass}>
			<DetailBreadcrumb
				dict={dict.breadcrumb}
				lang={lang}
				word={suggestion.entry?.word ?? ""}
				suggestionId={suggestion.id}
			/>

			<DetailHeader
				suggestion={suggestion}
				dict={dict.header}
				fieldsDict={dict.diff.fields}
				lang={lang}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
				<div>
					<DiffCard
						suggestion={suggestion}
						dict={dict}
						lang={lang}
						canReview={canReview}
						reviewComment={reviewComment}
						onReviewCommentChange={setReviewComment}
						confirmAction={confirmAction}
						onOpenConfirm={openConfirm}
						onCloseConfirm={closeConfirm}
						onSubmitReview={submitReview}
						isReviewing={isReviewing}
					/>

					<AdjacentNav adjacent={adjacent} dict={dict.nav} lang={lang} />
				</div>

				<aside>
					<InfoCard
						suggestion={suggestion}
						dict={dict.info}
						headerDict={dict.header}
						fieldsDict={dict.diff.fields}
						lang={lang}
					/>
					<EntryPreviewCard
						entry={entry}
						entryId={entryId}
						entryLoading={entryLoading}
						entryError={entryError}
						dict={dict.entryPreview}
						lang={lang}
					/>
					<QuickActionsCard
						suggestion={suggestion}
						dict={dict.quickActions}
						lang={lang}
					/>
				</aside>
			</div>
		</section>
	);
};
