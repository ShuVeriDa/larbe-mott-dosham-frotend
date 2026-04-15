// Deprecated: routes moved to app/[lang]/(main)/
// Proxy redirects all requests to /{lang}/...
export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <main className="flex-1">{children}</main>;
}
