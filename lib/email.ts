import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';

type EmailBrandingOptions = {
  title?: string;
  preheader?: string;
  bodyHtml: string;
  primaryColor?: string;
  accentColor?: string;
};

let cachedTransporter: Transporter | null = null;

export function getEmailTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
    throw new Error('EMAIL and EMAIL_PASSWORD must be set');
  }

  cachedTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development',
  });

  return cachedTransporter;
}

export async function verifyEmailTransporter(): Promise<void> {
  const transporter = getEmailTransporter();
  await transporter.verify();
}

export function renderBrandedEmail({
  title = 'ConnectCom Notification',
  preheader = '',
  bodyHtml,
  primaryColor = '#7f1d1d', // deep red used in site
  accentColor = '#fdf2f2',  // light red background
}: EmailBrandingOptions): string {
  // Always embed logo using CID sourced from local filesystem path.
  const logoUrl = 'cid:connectcom-logo';

  return `
  <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: ${primaryColor}; max-width: 640px; margin: 0 auto; padding: 24px;">
    <span style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">${preheader}</span>
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${logoUrl}" alt="ConnectCom" height="48" style="height:48px; width:auto; object-fit:contain;" />
      <div style="font-weight: 700; margin-top: 8px; font-size: 18px; color:${primaryColor}">ConnectCom</div>
    </div>
    <div style="background: ${accentColor}; border: 1px solid #f9d4d4; border-radius: 10px; padding: 20px;">
      <h1 style="color:${primaryColor}; font-size: 20px; margin: 0 0 12px 0;">${title}</h1>
      <div style="color:#8a6f37; line-height:1.6; font-size: 15px;">${bodyHtml}</div>
    </div>
    <div style="text-align:center; color:#b91c1c; font-size: 12px; margin-top: 16px;">
      © ${new Date().getFullYear()} ConnectCom
    </div>
  </div>
  `;
}

export type SendEmailArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
  replyTo?: string;
};

export async function sendBrandedEmail({ to, subject, html, text, fromName = 'ConnectCom Platform', replyTo }: SendEmailArgs) {
  const transporter = getEmailTransporter();
  const from = `${fromName} <${process.env.EMAIL}>`;
  const logoPath = path.join(process.cwd(), process.env.EMAIL_LOGO_PATH || 'public/logo.png');
  await transporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
    replyTo,
    attachments: [
      {
        filename: 'logo.png',
        path: logoPath,
        cid: 'connectcom-logo',
      },
    ],
  });
}


