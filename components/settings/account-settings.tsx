'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User } from 'lucide-react';

interface AccountSettingsProps {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
}

export function AccountSettings({ user }: AccountSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Email Display */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mt-1">
            <Mail className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 space-y-2">
            <Label className="text-base font-semibold">Email Address</Label>
            <Input
              type="email"
              value={user.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Your email address is used for login and notifications. Contact support to change it.
            </p>
          </div>
        </div>
      </div>

      {/* Name Display */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mt-1">
            <User className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 space-y-2">
            <Label className="text-base font-semibold">Account Name</Label>
            <Input
              type="text"
              value={user.name}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              This is your display name. Update it in the Profile tab.
            </p>
          </div>
        </div>
      </div>

      {/* Password Change (Better Auth handles this separately) */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mt-1">
            <Lock className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 space-y-2">
            <Label className="text-base font-semibold">Password</Label>
            <p className="text-sm text-muted-foreground mb-3">
              For security, password changes are handled through the forgot password flow.
            </p>
            <Button variant="outline" asChild>
              <a href="/forgot-password">Change Password</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Account Role Badge */}
      {user.role === 'admin' && (
        <div className="bg-accent/10 border border-accent rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full" />
            <p className="text-sm font-medium text-accent">
              Administrator Account
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            You have administrative privileges and can access the admin dashboard.
          </p>
        </div>
      )}

      {/* Danger Zone */}
      <div className="pt-6 border-t">
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-destructive uppercase tracking-wide">
            Danger Zone
          </h4>
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-3">
              Once you delete your account, all of your data will be permanently removed. This action cannot be undone.
            </p>
            <Button variant="destructive" disabled>
              Delete Account
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Contact support to request account deletion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
