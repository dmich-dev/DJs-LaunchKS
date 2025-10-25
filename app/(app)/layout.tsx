import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { user, userProfile } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { AppNav } from '@/components/layout/app-nav';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Get user data for nav
  const users = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  const profiles = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, session.user.id))
    .limit(1);

  const userData = users[0];
  const profileData = profiles.length > 0 ? profiles[0] : null;

  return (
    <div className="min-h-screen bg-background">
      <AppNav
        user={userData}
        profile={profileData}
      />
      <main>{children}</main>
    </div>
  );
}
