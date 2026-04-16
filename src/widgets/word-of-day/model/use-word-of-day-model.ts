"use client";

import { dictionaryApi, useWordOfDay } from "@/entities/dictionary";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { mapEntry, type MappedWordOfDay } from "./map-entry";

interface WordOfDayModel {
	lang: string;
	isLoading: boolean;
	isError: boolean;
	entryId?: number;
	mapped: MappedWordOfDay | null;
	isLoadingNext: boolean;
	fetchRandom: () => void;
}

export const useWordOfDayModel = (): WordOfDayModel => {
	const params = useParams();
	const lang = (params?.lang as string) ?? "ru";

	const { data: initialEntry, isLoading, isError } = useWordOfDay();

	const {
		mutate: fetchRandom,
		data: randomEntry,
		isPending: isLoadingNext,
	} = useMutation({
		mutationFn: () => dictionaryApi.getRandom(),
	});

	const currentEntry = randomEntry ?? initialEntry;

	return {
		lang,
		isLoading,
		isError,
		entryId: currentEntry?.id,
		mapped: currentEntry ? mapEntry(currentEntry) : null,
		isLoadingNext,
		fetchRandom,
	};
};
