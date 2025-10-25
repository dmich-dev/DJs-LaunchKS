'use client';

import { useSession, signOut } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  if (!session) {
    return null;
  }

  const initials = session.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b bg-white dark:bg-zinc-900">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
            <CardDescription>You are successfully logged in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={session.user.image || undefined} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{session.user.name}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{session.user.email}</p>
              </div>
            </div>

            <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-4 space-y-2">
              <h3 className="font-medium text-sm">Session Info</h3>
              <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <p>User ID: {session.user.id}</p>
                <p>Email Verified: {session.user.emailVerified ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              This is a starter dashboard. Replace this content with your app&apos;s main interface.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
