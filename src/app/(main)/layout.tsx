import { Header } from "@/widgets/header";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Header />
			<main className="flex-1">{children}</main>
		</>
	);
}
