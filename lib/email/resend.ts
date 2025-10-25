import { Resend } from 'resend';
import { render } from '@react-email/render';
import { db } from '@/lib/db';
import { email as emailTable, notificationPreference } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Email templates
import PlanReadyEmail from './templates/plan-ready';
import WeeklyReminderEmail from './templates/weekly-reminder';
import MilestoneCompleteEmail from './templates/milestone-complete';
import PhaseCompleteEmail from './templates/phase-complete';

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const FROM_EMAIL = 'LaunchKS <noreply@propelprep.com>';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Base email sending function
 */
export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  try {
    if (!resend) {
      console.warn('Resend API key not configured. Email would have been sent to:', to);
      return { success: false, error: 'Resend API key not configured' };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
          to,
          subject,
          html,
          ...(text && { text }),
        });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Log email to database
 */
async function logEmail(data: {
  userId?: string;
  to: string;
  subject: string;
  type: 'verification' | 'password_reset' | 'plan_ready' | 'reminder' | 'milestone_complete' | 'phase_complete' | 'admin_digest';
  status: 'queued' | 'sent' | 'failed';
  error?: string;
}) {
  try {
    await db.insert(emailTable).values({
      userId: data.userId,
      to: data.to,
      subject: data.subject,
      type: data.type,
      status: data.status,
      sentAt: data.status === 'sent' ? new Date() : null,
      error: data.error,
    });
  } catch (error) {
    console.error('Failed to log email:', error);
  }
}

/**
 * Check if user has opted in for email type
 */
async function canSendEmail(
  userId: string,
  type: 'reminder' | 'milestone' | 'phase'
): Promise<boolean> {
  try {
    const prefs = await db
      .select()
      .from(notificationPreference)
      .where(eq(notificationPreference.userId, userId))
      .limit(1);

    if (prefs.length === 0) return true; // Default to allowing

    const pref = prefs[0];
    switch (type) {
      case 'reminder':
        return pref.emailReminders;
      case 'milestone':
        return pref.milestoneEmails;
      case 'phase':
        return pref.phaseCompletionEmails;
      default:
        return true;
    }
  } catch (error) {
    console.error('Error checking email preferences:', error);
    return true; // Default to allowing on error
  }
}

/**
 * Send plan ready email
 */
export async function sendPlanReadyEmail(data: {
  userId: string;
  to: string;
  firstName: string;
  targetCareer: string;
  estimatedDuration: string;
  planId: string;
}) {
  const planUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

  const html = await render(
    PlanReadyEmail({
      firstName: data.firstName,
      targetCareer: data.targetCareer,
      estimatedDuration: data.estimatedDuration,
      planUrl,
    })
  );

  const subject = 'Your Career Transition Plan is Ready! ✈️';

  try {
    const result = await sendEmail({
      to: data.to,
      subject,
      html,
    });

    await logEmail({
      userId: data.userId,
      to: data.to,
      subject,
      type: 'plan_ready',
      status: result.success ? 'sent' : 'failed',
      error: result.success ? undefined : String(result.error || 'Unknown error'),
    });

    return result;
  } catch (error) {
    await logEmail({
      userId: data.userId,
      to: data.to,
      subject,
      type: 'plan_ready',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send weekly reminder email
 */
export async function sendWeeklyReminderEmail(data: {
  userId: string;
  to: string;
  firstName: string;
  progress: number;
  currentMilestone: string;
  nextTasks: string[];
}) {
  // Check preferences
  const canSend = await canSendEmail(data.userId, 'reminder');
  if (!canSend) {
    return { success: false, reason: 'User opted out of reminders' };
  }

  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

  const html = await render(
    WeeklyReminderEmail({
      firstName: data.firstName,
      progress: data.progress,
      currentMilestone: data.currentMilestone,
      nextTasks: data.nextTasks,
      dashboardUrl,
    })
  );

  const subject = `Keep up the momentum, ${data.firstName}!`;

  try {
    const result = await sendEmail({
      to: data.to,
      subject,
      html,
    });

    await logEmail({
      userId: data.userId,
      to: data.to,
      subject,
      type: 'reminder',
      status: result.success ? 'sent' : 'failed',
      error: result.success ? undefined : String(result.error || 'Unknown error'),
    });

    return result;
  } catch (error) {
    await logEmail({
      userId: data.userId,
      to: data.to,
      subject,
      type: 'reminder',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send milestone complete email
 */
export async function sendMilestoneCompleteEmail(data: {
  userId: string;
  to: string;
  firstName: string;
  milestoneTitle: string;
  progress: number;
  nextMilestone: string;
}) {
  // Check preferences
  const canSend = await canSendEmail(data.userId, 'milestone');
  if (!canSend) {
    return { success: false, reason: 'User opted out of milestone emails' };
  }

  const planUrl = `${process.env.NEXT_PUBLIC_APP_URL}/plan`;

  const html = await render(
    MilestoneCompleteEmail({
      firstName: data.firstName,
      milestoneTitle: data.milestoneTitle,
      progress: data.progress,
      nextMilestone: data.nextMilestone,
      planUrl,
    })
  );

  const subject = '🎊 Congratulations on completing a milestone!';

  try {
    const result = await sendEmail({
      to: data.to,
      subject,
      html,
    });

    await logEmail({
      userId: data.userId,
      to: data.to,
      subject,
      type: 'milestone_complete',
      status: result.success ? 'sent' : 'failed',
      error: result.success ? undefined : String(result.error || 'Unknown error'),
    });

    return result;
  } catch (error) {
    await logEmail({
      userId: data.userId,
      to: data.to,
      subject,
      type: 'milestone_complete',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send phase complete email
 */
export async function sendPhaseCompleteEmail(data: {
  userId: string;
  to: string;
  firstName: string;
  phaseTitle: string;
  progress: number;
  nextPhase: string;
}) {
  // Check preferences
  const canSend = await canSendEmail(data.userId, 'phase');
  if (!canSend) {
    return { success: false, reason: 'User opted out of phase completion emails' };
  }

  const planUrl = `${process.env.NEXT_PUBLIC_APP_URL}/plan`;

  const html = await render(
    PhaseCompleteEmail({
      firstName: data.firstName,
      phaseTitle: data.phaseTitle,
      progress: data.progress,
      nextPhase: data.nextPhase,
      planUrl,
    })
  );

  const subject = '🌟 Phase Complete! Great progress!';

  try {
    const result = await sendEmail({
      to: data.to,
      subject,
      html,
    });

    await logEmail({
      userId: data.userId,
      to: data.to,
      subject,
      type: 'phase_complete',
      status: result.success ? 'sent' : 'failed',
      error: result.success ? undefined : String(result.error || 'Unknown error'),
    });

    return result;
  } catch (error) {
    await logEmail({
      userId: data.userId,
      to: data.to,
      subject,
      type: 'phase_complete',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Helper to send verification email (keeps existing auth flow)
 */
export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  return sendEmail({
    to: email,
    subject: 'Verify your email address',
    html: `
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `,
    text: `Please verify your email address: ${verificationUrl}`,
  });
}

/**
 * Helper to send password reset email (keeps existing auth flow)
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  return sendEmail({
    to: email,
    subject: 'Reset your password',
    html: `
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `,
    text: `Reset your password: ${resetUrl}`,
  });
}
