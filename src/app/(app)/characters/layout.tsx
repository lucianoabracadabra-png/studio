import ClientProviders from '@/context/client-providers';

export default function CharactersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ClientProviders>{children}</ClientProviders>;
}
