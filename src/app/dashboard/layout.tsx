import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth/authOptions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return <>{children}</>;
}
