import { FC, ReactNode } from "react";

interface IHeroProps {
	children: ReactNode;
}

export const Hero: FC<IHeroProps> = ({ children }) => {
	return (
		<section className="relative min-h-[calc(100vh-52px)] flex flex-col items-center justify-center px-6 pt-16 pb-12 text-center overflow-hidden">
			{children}
		</section>
	);
};
