import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userProfile, notificationPreference, user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ProfileForm } from '@/components/settings/profile-form';
import { NotificationPreferences } from '@/components/settings/notification-preferences';
import { AccountSettings } from '@/components/settings/account-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function SettingsPage() {
  // Get authenticated user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Get user profile
  const profiles = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, session.user.id))
    .limit(1);

  if (profiles.length === 0) {
    redirect('/onboarding');
  }

  const profile = profiles[0];

  // Get notification preferences
  const prefs = await db
    .select()
    .from(notificationPreference)
    .where(eq(notificationPreference.userId, session.user.id))
    .limit(1);

  const preferences = prefs.length > 0 ? prefs[0] : null;

  // Get user account info
  const users = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  const userAccount = users[0];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-primary mb-2">Account Settings</h2>
          <p className="text-muted-foreground">
            Manage your profile, preferences, and account settings
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-primary mb-4">
                Profile Information
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Update your personal and professional information
              </p>
              <ProfileForm profile={profile} />
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-primary mb-4">
                Notification Preferences
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Choose what emails you want to receive
              </p>
              <NotificationPreferences preferences={preferences} />
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-primary mb-4">
                Account Settings
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Manage your email and password
              </p>
              <AccountSettings user={userAccount} />
            </div>
          </TabsContent>
        </Tabs>
    </div>
  );
}
