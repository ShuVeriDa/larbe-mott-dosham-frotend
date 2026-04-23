"use client";

import { type User, useUpdateProfile, type UpdateProfileDto } from "@/entities/user";
import type { Dictionary } from "@/i18n/dictionaries";
import { isApiError } from "@/shared/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Fields = { name: string; username: string; email: string };
type FieldErrors = Partial<Record<keyof Fields, string>>;

const USERNAME_RE = /^[a-zA-Z0-9_.-]{2,16}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const pickDto = (curr: Fields, initial: Fields): UpdateProfileDto => {
	const dto: UpdateProfileDto = {};
	if (curr.name.trim() !== initial.name) dto.name = curr.name.trim();
	if (curr.username.trim() !== initial.username) dto.username = curr.username.trim();
	if (curr.email.trim() !== initial.email) dto.email = curr.email.trim();
	return dto;
};

export const usePersonalForm = (user: User, dict: Dictionary["profile"]["personal"]) => {
	const initial: Fields = { name: user.name, username: user.username, email: user.email };
	const [values, setValues] = useState<Fields>(initial);
	const [errors, setErrors] = useState<FieldErrors>({});
	const { mutateAsync, isPending } = useUpdateProfile();

	useEffect(() => {
		setValues({ name: user.name, username: user.username, email: user.email });
	}, [user.name, user.username, user.email]);

	const setField = (key: keyof Fields, value: string) => {
		setValues(v => ({ ...v, [key]: value }));
		if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
	};

	const validate = (): FieldErrors => {
		const next: FieldErrors = {};
		if (!values.name.trim()) next.name = dict.nameRequired;
		if (!USERNAME_RE.test(values.username.trim())) next.username = dict.invalidUsername;
		if (!EMAIL_RE.test(values.email.trim())) next.email = dict.invalidEmail;
		return next;
	};

	const reset = () => {
		setValues(initial);
		setErrors({});
	};

	const submit = async () => {
		const next = validate();
		setErrors(next);
		if (Object.keys(next).length > 0) return;

		const dto = pickDto(values, initial);
		if (Object.keys(dto).length === 0) return;

		try {
			await mutateAsync(dto);
			toast.success(dict.saveSuccess);
		} catch (error) {
			if (isApiError(error) && error.statusCode === 409) {
				setErrors(e => ({ ...e, username: dict.usernameTaken }));
				return;
			}
			toast.error(dict.saveError);
		}
	};

	const dirty =
		values.name.trim() !== initial.name ||
		values.username.trim() !== initial.username ||
		values.email.trim() !== initial.email;

	return { values, errors, setField, reset, submit, isPending, dirty };
};
