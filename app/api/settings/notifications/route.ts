import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { notificationPreference } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const notificationSchema = z.object({
  emailReminders: z.boolean(),
  reminderFrequency: z.enum(['daily', 'weekly', 'biweekly']),
  milestoneEmails: z.boolean(),
  phaseCompletionEmails: z.boolean(),
  marketingEmails: z.boolean(),
});

export async function PUT(request: Request) {
  try {
    // Get the authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate the request body
    const validationResult = notificationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if preferences exist
    const existingPrefs = await db
      .select()
      .from(notificationPreference)
      .where(eq(notificationPreference.userId, session.user.id))
      .limit(1);

    if (existingPrefs.length === 0) {
      // Create new preferences if they don't exist
      await db.insert(notificationPreference).values({
        userId: session.user.id,
        emailReminders: data.emailReminders,
        reminderFrequency: data.reminderFrequency,
        milestoneEmails: data.milestoneEmails,
        phaseCompletionEmails: data.phaseCompletionEmails,
        marketingEmails: data.marketingEmails,
      });
    } else {
      // Update existing preferences
      await db
        .update(notificationPreference)
        .set({
          emailReminders: data.emailReminders,
          reminderFrequency: data.reminderFrequency,
          milestoneEmails: data.milestoneEmails,
          phaseCompletionEmails: data.phaseCompletionEmails,
          marketingEmails: data.marketingEmails,
          updatedAt: new Date(),
        })
        .where(eq(notificationPreference.userId, session.user.id));
    }

    return NextResponse.json({
      success: true,
      message: 'Notification preferences updated successfully',
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update preferences',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get the authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the notification preferences
    const prefs = await db
      .select()
      .from(notificationPreference)
      .where(eq(notificationPreference.userId, session.user.id))
      .limit(1);

    if (prefs.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Preferences not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: prefs[0],
    });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch preferences',
      },
      { status: 500 }
    );
  }
}
