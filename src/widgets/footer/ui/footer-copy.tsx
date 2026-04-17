import { FC } from "react";

interface FooterCopyProps {
	copy: string;
}

export const FooterCopy: FC<FooterCopyProps> = ({ copy }) => (
	<div className="text-xs text-faint">{copy}</div>
);
