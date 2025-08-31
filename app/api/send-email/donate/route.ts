export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { name, email, phone, amount, message } = await req.json();

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
    subject: `New Donation Received`,
    replyTo: email,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nAmount: ${amount}\nMessage: ${message}`,
    html: `
      <div style="font-family: 'Lexend', 'Noto Sans', Arial, sans-serif; color: #1c140d;">
        <img src=\"cid:${logoCid}\" alt=\"Boost Health Initiative Logo\" style=\"height:60px; margin-bottom: 16px;\" />
        <h2>New Donation Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Amount:</strong> UGX ${amount}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      </div>
    `,
    attachments: [
      {
        filename: 'BOOST HEALTH.png',
        path: logoPath,
        cid: logoCid,
      },
    ],
  };

  // Auto-reply to donor
  const userMailOptions = {
    from: `"Boost Health Initiative" <${process.env.EMAIL}>`,
    to: email,
    subject: 'Thank you for your donation to Boost Health Initiative!',
    text: `Dear ${name},\n\nThank you for your generous donation of UGX ${amount} to Boost Health Initiative. We have received your contribution and will reach out to you soon.\n\nBest regards,\nThe Boost Health Initiative Team`,
    html: `
      <div style="font-family: 'Lexend', 'Noto Sans', Arial, sans-serif; color: #1c140d;">
        <img src=\"cid:${logoCid}\" alt=\"Boost Health Initiative Logo\" style=\"height:60px; margin-bottom: 16px;\" />
        <h2>Thank you for your donation!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for your generous donation of <strong>UGX ${amount}</strong> to Boost Health Initiative. We have received your contribution and will reach out to you soon.</p>
        <p style=\"margin-top: 24px;\">Best regards,<br/>The Boost Health Initiative Team</p>
      </div>
    `,
    attachments: [
      {
        filename: 'BOOST HEALTH.png',
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
    console.error('Error sending donation email:', error);
    return NextResponse.json({ success: false, error: 'Failed to send donation email.' }, { status: 500 });
  }
}
