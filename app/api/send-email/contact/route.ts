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

  const logoCid = 'bhi-logo@cid';
  const logoPath = `${process.cwd()}/public/BOOST HEALTH.png`;

  // Email to Boost Health Initiative
  const orgMailOptions = {
    from: `"${name}" <${process.env.EMAIL}>`,
    to: process.env.EMAIL,
    subject: `New Contact Form Submission: ${subject}`,
    replyTo: email,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}`,
    html: `
      <div style="font-family: 'Lexend', 'Noto Sans', Arial, sans-serif; color: #1c140d;">
        <img src=\"cid:${logoCid}\" alt=\"Boost Health Initiative Logo\" style=\"height:60px; margin-bottom: 16px;\" />
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      </div>
    `,
    attachments: [
      {
        filename: 'BOOST HEALTH PNG LOGO ICON Bckg TRANS.png',
        path: logoPath,
        cid: logoCid,
      },
    ],
  };

  // Auto-reply to user
  const userMailOptions = {
    from: `"Boost Health Initiative" <${process.env.EMAIL}>`,
    to: email,
    subject: 'Thank you for contacting Boost Health Initiative!',
    text: `Dear ${name},\n\nThank you for reaching out to Boost Health Initiative. We have received your message and will get back to you soon.\n\nBest regards,\nThe Boost Health Initiative Team`,
    html: `
      <div style="font-family: 'Lexend', 'Noto Sans', Arial, sans-serif; color: #1c140d;">
        <img src=\"cid:${logoCid}\" alt=\"Boost Health Initiative Logo\" style=\"height:60px; margin-bottom: 16px;\" />
        <h2>Thank you for contacting Boost Health Initiative!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to Boost Health Initiative. We have received your message and will get back to you soon.</p>
        <p style=\"margin-top: 24px;\">Best regards,<br/>The Boost Health Initiative Team</p>
      </div>
    `,
    attachments: [
      {
        filename: 'BOOST HEALTH PNG LOGO ICON Bckg TRANS.png',
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
