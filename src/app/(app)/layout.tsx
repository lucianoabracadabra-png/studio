import AppLayout from '@/components/layout/app-layout';
import ClientProviders from '@/context/client-providers';

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProviders>
      <AppLayout>
        <div className="flex-grow flex flex-col">
          {children}
        </div>
      </AppLayout>
    </ClientProviders>
  );
}
