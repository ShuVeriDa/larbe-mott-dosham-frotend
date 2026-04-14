import { Typography } from "@/shared/ui";

const HERO_LETTERS: { text: string; style: React.CSSProperties }[] = [
	{ text: "ХIай", style: { top: "8%", left: "5%", animationDelay: "0s" } },
	{ text: "Нахчий", style: { top: "15%", right: "8%", animationDelay: "-4s" } },
	{ text: "ларбе", style: { top: "50%", right: "4%", animationDelay: "-12s" } },
	{ text: "шайᵸ", style: { bottom: "20%", left: "12%", animationDelay: "-8s" } },
	{ text: "мотт", style: { bottom: "10%", right: "20%", animationDelay: "-16s" } },
	{ text: "къам", style: { top: "35%", left: "2%", animationDelay: "-6s" } },
];

export function HeroBgLetters() {
	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.05]">
			{HERO_LETTERS.map(({ text, style }) => (
				<Typography
					key={text}
					tag="span"
					size="base"
					className="hero-bg-letter absolute text-[clamp(3rem,8vw,7rem)] font-extrabold text-foreground"
					style={style}
				>
					{text}
				</Typography>
			))}
		</div>
	);
}
