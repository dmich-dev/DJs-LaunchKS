import { betterAuth, env } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { sendEmail } from "../email/resend";
import { getPasswordResetEmailTemplate, getVerificationEmailTemplate } from "../email/templates";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
          const template = getPasswordResetEmailTemplate({
            userName: user.name,
            resetUrl: url,
          });
    
          await sendEmail({
            to: user.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
          });
        },
      },

      emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
          const template = getVerificationEmailTemplate({
            userName: user.name,
            verificationUrl: url,
          });
    
          await sendEmail({
            to: user.email,
            subject: template.subject,
            html: template.html,
            text: template.text,
          });
        },
      },

    session: {
        expiresIn: 60 * 60 * 24 * 30,
        updateAge: 60 * 60 * 24,
    },

    rateLimit: {
        enabled: true,
        max: 10,
        window: 60,
    },

    advanced: {
        useSecureCookies: env.NODE_ENV === 'production',
        crossSubDomainCookies: {
          enabled: false,
        },
      },
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;