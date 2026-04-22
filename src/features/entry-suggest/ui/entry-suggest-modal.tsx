"use client";

import { useCreateSuggestion } from "@/features/suggestions";
import { useIsAuthenticated } from "@/shared/lib/auth";
import { isApiError } from "@/shared/api";
import type { Dictionary } from "@/i18n/dictionaries";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui/primitives/dialog";
import { Button } from "@/shared/ui/primitives/button";
import { Input } from "@/shared/ui/primitives/input";
import { useParams, useRouter } from "next/navigation";
import { type FC, useEffect, useState } from "react";
import { toast } from "sonner";

type SuggestDict = Dictionary["entry"]["suggest"];
type FieldKey = keyof SuggestDict["fields"];

const FIELD_ORDER: FieldKey[] = [
	"meanings",
	"word",
	"nounClass",
	"partOfSpeech",
	"phraseology",
	"other",
];

interface EntrySuggestModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	entryId: number;
	word: string;
	lang: string;
	dict: SuggestDict;
}

export const EntrySuggestModal: FC<EntrySuggestModalProps> = ({
	open,
	onOpenChange,
	entryId,
	word,
	dict,
}) => {
	const router = useRouter();
	const params = useParams<{ lang: string }>();
	const isAuthenticated = useIsAuthenticated();
	const { mutate, isPending } = useCreateSuggestion();

	const [field, setField] = useState<FieldKey>("meanings");
	const [newValue, setNewValue] = useState("");
	const [comment, setComment] = useState("");

	useEffect(() => {
		if (!open) {
			setField("meanings");
			setNewValue("");
			setComment("");
		}
	}, [open]);

	useEffect(() => {
		if (open && !isAuthenticated) {
			onOpenChange(false);
			toast.info(dict.loginRequired);
			router.push(`/${params.lang}/login`);
		}
	}, [open, isAuthenticated, onOpenChange, router, params.lang, dict.loginRequired]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!newValue.trim()) return;

		mutate(
			{
				entryId,
				field,
				newValue: newValue.trim(),
				comment: comment.trim() || undefined,
			},
			{
				onSuccess: () => {
					toast.success(dict.success);
					onOpenChange(false);
				},
				onError: error => {
					const message = isApiError(error) ? error.message : dict.error;
					toast.error(message || dict.error);
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{dict.title}</DialogTitle>
					<DialogDescription>
						{dict.wordLabel}{" "}
						<strong className="text-foreground" lang="ce">
							{word}
						</strong>
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div>
						<label
							htmlFor="suggest-field"
							className="block text-sm font-medium text-foreground mb-2"
						>
							{dict.fieldLabel}
						</label>
						<select
							id="suggest-field"
							value={field}
							onChange={e => setField(e.target.value as FieldKey)}
							disabled={isPending}
							className="w-full px-4 py-3 border border-edge rounded-md text-base bg-surface text-foreground outline-none focus:border-primary focus:shadow-focus cursor-pointer"
						>
							{FIELD_ORDER.map(key => (
								<option key={key} value={key}>
									{dict.fields[key]}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							htmlFor="suggest-value"
							className="block text-sm font-medium text-foreground mb-2"
						>
							{dict.newValueLabel}
						</label>
						<textarea
							id="suggest-value"
							value={newValue}
							onChange={e => setNewValue(e.target.value)}
							placeholder={dict.newValuePlaceholder}
							disabled={isPending}
							required
							className="w-full px-4 py-3 border border-edge rounded-md text-base bg-surface text-foreground outline-none resize-y min-h-[80px] leading-relaxed focus:border-primary focus:shadow-focus"
						/>
					</div>

					<div>
						<label
							htmlFor="suggest-comment"
							className="block text-sm font-medium text-foreground mb-2"
						>
							{dict.commentLabel}
						</label>
						<Input
							id="suggest-comment"
							value={comment}
							onChange={e => setComment(e.target.value)}
							placeholder={dict.commentPlaceholder}
							disabled={isPending}
						/>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="secondary"
							onClick={() => onOpenChange(false)}
							disabled={isPending}
						>
							{dict.cancel}
						</Button>
						<Button
							type="submit"
							variant="primary"
							disabled={isPending || !newValue.trim()}
						>
							{isPending ? dict.submitting : dict.submit}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
