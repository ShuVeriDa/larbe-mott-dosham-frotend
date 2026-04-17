import type { Dictionary } from "@/i18n/dictionaries";
import { FC } from "react";
import { API_CODE_LINES } from "../model/api-code-lines";

interface IApiCodeBlockProps {
	codeLines: Dictionary["apiSection"]["codeLines"];
}

export const ApiCodeBlock: FC<IApiCodeBlockProps> = ({ codeLines }) => (
	<div className="bg-code border-t border-code-edge px-8 py-6 font-mono text-sm leading-[2] text-subtle overflow-x-auto">
		{API_CODE_LINES.map(({ kind, key }) => {
			const text = codeLines[key];

			if (kind === "comment") {
				return (
					<div key={key}>
						<span className="text-faint">{text}</span>
					</div>
				);
			}

			const spaceIdx = text.indexOf(" ");
			const method = text.slice(0, spaceIdx);
			const path = text.slice(spaceIdx + 1);

			return (
				<div key={key}>
					<span className="text-primary">{method}</span>{" "}
					<span className="text-muted">{path}</span>
				</div>
			);
		})}
	</div>
);
