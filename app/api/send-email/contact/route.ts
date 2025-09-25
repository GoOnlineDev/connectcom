export const dynamic = "force-dynamic";
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { getEmailTransporter, renderBrandedEmail, sendBrandedEmail, verifyEmailTransporter } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    // Validate required environment variables
    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
      console.error('Missing required environment variables: EMAIL or EMAIL_PASSWORD');
      return NextResponse.json({ 
        success: false, 
        error: 'Email service not configured' 
      }, { status: 500 });
    }

    // Validate required parameters
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: name, email, subject, or message' 
      }, { status: 400 });
    }

    // Verify SMTP connection
    try {
      getEmailTransporter();
      await verifyEmailTransporter();
      console.log('SMTP server is ready for contact form emails');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return NextResponse.json({ 
        success: false, 
        error: 'Email service connection failed' 
      }, { status: 500 });
    }

    // Email to ConnectCom Admin (no attachments to avoid path issues)
    const orgMailHtml = renderBrandedEmail({
      title: '📧 New Contact Form Submission',
      preheader: `${name} submitted the contact form`,
      bodyHtml: `
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #7f1d1d; width: 30%;">Name:</td>
            <td style="padding: 8px 0; color: #b91c1c;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #7f1d1d;">Email:</td>
            <td style="padding: 8px 0; color: #b91c1c;"><a href="mailto:${email}" style="color: #b91c1c;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #7f1d1d;">Phone:</td>
            <td style="padding: 8px 0; color: #b91c1c;">${phone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #7f1d1d;">Subject:</td>
            <td style="padding: 8px 0; color: #b91c1c;">${subject}</td>
          </tr>
        </table>
        <div style="background: #faf6ed; border: 1px solid #f4ecd8; border-radius: 8px; padding: 16px; margin-top: 16px;">
          <h3 style="color: #7f1d1d; margin: 0 0 8px 0; font-size: 16px;">Message</h3>
          <p style="color: #8a6f37; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    // Auto-reply to user
    const userMailHtml = renderBrandedEmail({
      title: 'Thank you for contacting ConnectCom!',
      preheader: 'We received your message and will reply soon',
      bodyHtml: `
        <p style="margin:0 0 12px 0; color:#7f1d1d;">Dear ${name},</p>
        <p style="margin:0 0 12px 0; color:#7f1d1d;">Thank you for reaching out to ConnectCom. We have received your message and will get back to you within 24-48 hours.</p>
        <div style="background: #faf6ed; border: 1px solid #f4ecd8; border-radius: 6px; padding: 12px; margin: 16px 0 8px;">
          <p style="margin:0; color:#8a6f37; font-weight:600;">Your message subject: "${subject}"</p>
        </div>
        <div style="text-align:center; margin-top:16px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://connectcom.com'}/shops" style="background:#7f1d1d;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;margin-right:8px;">Browse Shops</a>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://connectcom.com'}/categories" style="background:transparent;color:#7f1d1d;padding:10px 18px;border:1px solid #7f1d1d;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;">View Categories</a>
        </div>
        <p style="text-align:center;margin-top:16px;color:#b91c1c;font-size:14px;">Best regards,<br/>The ConnectCom Team</p>
      `,
    });

    // Send both emails
    await sendBrandedEmail({
      to: process.env.EMAIL as string,
      subject: `New Contact Form Submission: ${subject}`,
      html: orgMailHtml,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nSubject: ${subject}\nMessage: ${message}`,
      fromName: name,
      replyTo: email,
    });
    console.log('Contact form email sent to admin');

    await sendBrandedEmail({
      to: email,
      subject: 'Thank you for contacting ConnectCom!',
      html: userMailHtml,
      text: `Dear ${name}, Thank you for reaching out to ConnectCom. We will reply within 24-48 hours. Your message: "${subject}"`,
    });
    console.log(`Contact form confirmation sent to ${email}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending contact form emails:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email.' 
    }, { status: 500 });
  }
}