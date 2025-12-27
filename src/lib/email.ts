import { Resend } from 'resend';

// Use a placeholder API key during build time to prevent errors
// The actual API key will be used at runtime
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_placeholder_key_for_build';

if (!process.env.RESEND_API_KEY && process.env.NODE_ENV !== 'production') {
  console.warn('RESEND_API_KEY is not defined in environment variables');
}

export const resend = new Resend(RESEND_API_KEY);

export const EMAIL_CONFIG = {
  from: process.env.FROM_EMAIL || 'ShennaStudio <orders@shennastudio.com>',
  replyTo: process.env.REPLY_TO_EMAIL || 'support@shennastudio.com',
} as const;

interface SendEmailParams {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  replyTo?: string;
}

export async function sendEmail({ to, subject, react, replyTo }: SendEmailParams) {
  // Skip email sending if no valid API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.warn('Email not sent - RESEND_API_KEY not configured');
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: Array.isArray(to) ? to : [to],
      subject,
      react,
      replyTo: replyTo || EMAIL_CONFIG.replyTo,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Email sent successfully:', data?.id);
    return data;
  } catch (error: unknown) {
    console.error('Email sending failed:', error);
    throw error;
  }
}
