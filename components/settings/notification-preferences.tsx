'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Bell, Mail, CheckCircle2, Award } from 'lucide-react';

const notificationSchema = z.object({
  emailReminders: z.boolean(),
  reminderFrequency: z.enum(['daily', 'weekly', 'biweekly']),
  milestoneEmails: z.boolean(),
  phaseCompletionEmails: z.boolean(),
  marketingEmails: z.boolean(),
});

type NotificationInput = z.infer<typeof notificationSchema>;

interface NotificationPreferencesProps {
  preferences: {
    emailReminders: boolean;
    reminderFrequency: 'daily' | 'weekly' | 'biweekly';
    milestoneEmails: boolean;
    phaseCompletionEmails: boolean;
    marketingEmails: boolean;
  } | null;
}

export function NotificationPreferences({ preferences }: NotificationPreferencesProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NotificationInput>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailReminders: preferences?.emailReminders ?? true,
      reminderFrequency: preferences?.reminderFrequency ?? 'weekly',
      milestoneEmails: preferences?.milestoneEmails ?? true,
      phaseCompletionEmails: preferences?.phaseCompletionEmails ?? true,
      marketingEmails: preferences?.marketingEmails ?? false,
    },
  });

  const { handleSubmit, watch, setValue } = form;

  const emailReminders = watch('emailReminders');
  const reminderFrequency = watch('reminderFrequency');
  const milestoneEmails = watch('milestoneEmails');
  const phaseCompletionEmails = watch('phaseCompletionEmails');
  const marketingEmails = watch('marketingEmails');

  const onSubmit = async (data: NotificationInput) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update preferences');
      }

      toast.success('Notification preferences updated!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Progress Reminders */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mt-1">
              <Bell className="w-5 h-5 text-accent" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="emailReminders" className="text-base font-semibold cursor-pointer">
                Progress Reminders
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive regular reminders to keep you on track with your career plan
              </p>
            </div>
          </div>
          <Switch
            id="emailReminders"
            checked={emailReminders}
            onCheckedChange={(checked) => setValue('emailReminders', checked)}
          />
        </div>

        {emailReminders && (
          <div className="ml-13 pl-4 border-l-2 border-muted">
            <Label htmlFor="reminderFrequency" className="text-sm">
              Reminder Frequency
            </Label>
            <Select
              value={reminderFrequency}
              onValueChange={(value) => setValue('reminderFrequency', value as 'daily' | 'weekly' | 'biweekly')}
            >
              <SelectTrigger className="mt-2 max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly (Recommended)</SelectItem>
                <SelectItem value="biweekly">Every 2 Weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Milestone Completion Emails */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mt-1">
            <CheckCircle2 className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="milestoneEmails" className="text-base font-semibold cursor-pointer">
              Milestone Celebrations
            </Label>
            <p className="text-sm text-muted-foreground">
              Get congratulations emails when you complete important milestones
            </p>
          </div>
        </div>
        <Switch
          id="milestoneEmails"
          checked={milestoneEmails}
          onCheckedChange={(checked) => setValue('milestoneEmails', checked)}
        />
      </div>

      {/* Phase Completion Emails */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mt-1">
            <Award className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phaseCompletionEmails" className="text-base font-semibold cursor-pointer">
              Phase Completions
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications when you finish a major phase in your career journey
            </p>
          </div>
        </div>
        <Switch
          id="phaseCompletionEmails"
          checked={phaseCompletionEmails}
          onCheckedChange={(checked) => setValue('phaseCompletionEmails', checked)}
        />
      </div>

      {/* Marketing Emails */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mt-1">
            <Mail className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="marketingEmails" className="text-base font-semibold cursor-pointer">
              Tips & Resources
            </Label>
            <p className="text-sm text-muted-foreground">
              Get helpful career tips, new resources, and LaunchKS updates
            </p>
          </div>
        </div>
        <Switch
          id="marketingEmails"
          checked={marketingEmails}
          onCheckedChange={(checked) => setValue('marketingEmails', checked)}
        />
      </div>

      {/* Info Box */}
      <div className="bg-muted/50 border border-muted rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Note:</strong> We'll never spam you. You can change these
          preferences at any time, and you'll always receive important account-related emails.
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Preferences'
          )}
        </Button>
      </div>
    </form>
  );
}
