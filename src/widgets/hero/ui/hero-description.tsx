import { Typography } from "@/shared/ui";

export function HeroDescription() {
	return (
		<Typography
			tag="p"
			size="base"
			className="text-[clamp(0.95rem,2vw,1.25rem)] text-subtle font-light leading-[1.7] max-w-[520px] mx-auto mb-10"
		>
			Единый цифровой словарь чеченского языка — поиск, морфология,
			склонение, спряжение и API из всех основных источников
		</Typography>
	);
}
