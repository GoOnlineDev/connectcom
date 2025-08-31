export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { name, email, phone, subject, message } = await req.json();

  // Set up transporter with TLS (port 587)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use TLS
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const logoCid = 'connectcom-logo@cid';
  const logoPath = `${process.cwd()}/public/logo.png`;

  // Email to ConnectCom Admin
  const orgMailOptions = {
    from: `"${name}" <${process.env.EMAIL}>`,
    to: process.env.EMAIL,
    subject: `New Contact Form Submission: ${subject}`,
    replyTo: email,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}`,
    html: `
      <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #7f1d1d; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="cid:${logoCid}" alt="ConnectCom Logo" style="height: 60px; margin-bottom: 16px;" />
          <h1 style="color: #7f1d1d; margin: 0; font-size: 24px; font-weight: bold;">New Contact Form Submission</h1>
        </div>
        
        <div style="background: #fdf2f2; border: 1px solid #f9d4d4; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
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
              <td style="padding: 8px 0; color: #b91c1c;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #7f1d1d;">Subject:</td>
              <td style="padding: 8px 0; color: #b91c1c;">${subject}</td>
            </tr>
          </table>
        </div>

        <div style="background: #faf6ed; border: 1px solid #f4ecd8; border-radius: 8px; padding: 16px;">
          <h3 style="color: #7f1d1d; margin: 0 0 8px 0; font-size: 16px;">Message</h3>
          <p style="color: #8a6f37; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: 'connectcom-logo.png',
        path: logoPath,
        cid: logoCid,
      },
    ],
  };

  // Auto-reply to user
  const userMailOptions = {
    from: `"ConnectCom Platform" <${process.env.EMAIL}>`,
    to: email,
    subject: 'Thank you for contacting ConnectCom!',
    text: `Dear ${name},\n\nThank you for reaching out to ConnectCom. We have received your message and will get back to you within 24-48 hours.\n\nYour message: "${subject}"\n\nBest regards,\nThe ConnectCom Team`,
    html: `
      <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #7f1d1d; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="cid:${logoCid}" alt="ConnectCom Logo" style="height: 60px; margin-bottom: 16px;" />
          <h1 style="color: #7f1d1d; margin: 0; font-size: 24px; font-weight: bold;">Thank you for contacting ConnectCom!</h1>
        </div>
        
        <div style="background: #fdf2f2; border: 1px solid #f9d4d4; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <p style="color: #7f1d1d; margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">Dear ${name},</p>
          <p style="color: #7f1d1d; margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">Thank you for reaching out to ConnectCom. We have received your message and will get back to you within 24-48 hours.</p>
          
          <div style="background: #faf6ed; border: 1px solid #f4ecd8; border-radius: 6px; padding: 16px; margin: 16px 0;">
            <p style="color: #8a6f37; margin: 0; font-weight: 600;">Your message: "${subject}"</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #f9d4d4;">
          <p style="color: #7f1d1d; margin-bottom: 16px;">While you wait, explore our platform:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/shops" 
             style="background: #7f1d1d; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block; margin-right: 12px;">
            Browse Shops
          </a>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/categories" 
             style="background: transparent; color: #7f1d1d; padding: 12px 24px; border: 1px solid #7f1d1d; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">
            View Categories
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #f9d4d4;">
          <p style="color: #b91c1c; font-size: 14px; margin: 0;">Best regards,<br/>The ConnectCom Team</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: 'connectcom-logo.png',
        path: logoPath,
        cid: logoCid,
      },
    ],
  };

  try {
    await transporter.sendMail(orgMailOptions);
    await transporter.sendMail(userMailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email.' }, { status: 500 });
  }
}
