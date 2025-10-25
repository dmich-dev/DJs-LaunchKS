import { Resend } from 'resend';

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const FROM_EMAIL = 'App <noreply@resend.dev>';

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = FROM_EMAIL,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}) {
  try {
    if (!html && !text) {
      throw new Error('Either html or text content must be provided');
    }

    if (!resend) {
      console.warn('Resend API key not configured. Email would have been sent to:', to);
      return { success: false, error: 'Resend API key not configured' };
    }

    const { data, error } = html
      ? await resend.emails.send({
          from,
          to,
          subject,
          html,
          ...(text && { text }),
        })
      : await resend.emails.send({
          from,
          to,
          subject,
          text: text!,
        });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
