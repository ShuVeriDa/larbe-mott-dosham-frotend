"use client";

import { useUpdatePassword } from "@/entities/user";
import type { Dictionary } from "@/i18n/dictionaries";
import { isApiError } from "@/shared/api";
import { useState } from "react";
import { toast } from "sonner";

type Fields = { currentPassword: string; newPassword: string; confirmPassword: string };
type FieldErrors = Partial<Record<keyof Fields, string>>;

const empty: Fields = { currentPassword: "", newPassword: "", confirmPassword: "" };

const STRENGTH_RE = /^(?=.*[A-Z])(?=.*[^\w\s]).{8,}$/;

export const usePasswordForm = (dict: Dictionary["profile"]["security"]) => {
	const [values, setValues] = useState<Fields>(empty);
	const [errors, setErrors] = useState<FieldErrors>({});
	const { mutateAsync, isPending } = useUpdatePassword();

	const setField = (key: keyof Fields, value: string) => {
		setValues(v => ({ ...v, [key]: value }));
		if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
	};

	const validate = (): FieldErrors => {
		const next: FieldErrors = {};
		if (!values.currentPassword) next.currentPassword = dict.error;
		if (!STRENGTH_RE.test(values.newPassword)) next.newPassword = dict.passwordTooWeak;
		if (values.newPassword !== values.confirmPassword) {
			next.confirmPassword = dict.passwordsDoNotMatch;
		}
		return next;
	};

	const submit = async () => {
		const next = validate();
		setErrors(next);
		if (Object.keys(next).length > 0) return;

		try {
			await mutateAsync({
				currentPassword: values.currentPassword,
				newPassword: values.newPassword,
			});
			toast.success(dict.success);
			setValues(empty);
			setErrors({});
		} catch (error) {
			if (isApiError(error) && error.statusCode === 401) {
				setErrors(e => ({ ...e, currentPassword: dict.currentPasswordIncorrect }));
				return;
			}
			toast.error(dict.error);
		}
	};

	return { values, errors, setField, submit, isPending };
};
