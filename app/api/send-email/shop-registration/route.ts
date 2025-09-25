export const dynamic = "force-dynamic";
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { renderBrandedEmail, sendBrandedEmail, verifyEmailTransporter, getEmailTransporter } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { shopName, shopType, ownerEmail, ownerName, categories, description, contactInfo } = await req.json();

    // Validate required environment variables
    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
      console.error('Missing required environment variables: EMAIL or EMAIL_PASSWORD');
      return NextResponse.json({ 
        success: false, 
        error: 'Email service not configured' 
      }, { status: 500 });
    }

    // Verify SMTP connection
    try {
      getEmailTransporter();
      await verifyEmailTransporter();
      console.log('SMTP server is ready to take our messages');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return NextResponse.json({ 
        success: false, 
        error: 'Email service connection failed' 
      }, { status: 500 });
    }

    // Email to Admin about new shop registration (no attachments to avoid path issues)
    const adminHtml = renderBrandedEmail({
      title: '🏪 New Shop Registration',
      preheader: `${ownerName} registered ${shopName}`,
      bodyHtml: `
        <h2 style="margin:0 0 12px 0; font-size: 18px; color:#7f1d1d;">Shop Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding:6px 0; font-weight:600; width:30%;">Shop Name:</td><td style="padding:6px 0; color:#b91c1c;">${shopName}</td></tr>
          <tr><td style="padding:6px 0; font-weight:600;">Shop Type:</td><td style="padding:6px 0; color:#b91c1c;">${shopType === 'product_shop' ? 'Product Shop' : 'Service Shop'}</td></tr>
          <tr><td style="padding:6px 0; font-weight:600;">Owner:</td><td style="padding:6px 0; color:#b91c1c;">${ownerName}</td></tr>
          <tr><td style="padding:6px 0; font-weight:600;">Owner Email:</td><td style="padding:6px 0; color:#b91c1c;"><a href="mailto:${ownerEmail}" style="color:#b91c1c;">${ownerEmail}</a></td></tr>
          <tr><td style="padding:6px 0; font-weight:600;">Categories:</td><td style="padding:6px 0; color:#b91c1c;">${categories?.join(', ') || 'None specified'}</td></tr>
        </table>
        ${description ? `<div style="margin-top:12px; padding:12px; border:1px solid #f4ecd8; border-radius:8px; color:#8a6f37;">${description}</div>` : ''}
        <div style="margin-top:12px;">
          <h3 style="margin:0 0 8px 0; font-size:16px; color:#7f1d1d;">Contact Information</h3>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:4px 0; font-weight:600; width:30%;">Email:</td><td style="padding:4px 0; color:#8a6f37;">${contactInfo?.email || 'Not provided'}</td></tr>
            <tr><td style="padding:4px 0; font-weight:600;">Phone:</td><td style="padding:4px 0; color:#8a6f37;">${contactInfo?.phone || 'Not provided'}</td></tr>
            <tr><td style="padding:4px 0; font-weight:600;">Website:</td><td style="padding:4px 0; color:#8a6f37;">${contactInfo?.website || 'Not provided'}</td></tr>
          </table>
        </div>
        <div style="text-align:center; margin-top:16px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/shops/approve" style="background:#7f1d1d;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;">Review in Admin Dashboard</a>
        </div>
      `,
    });

    await sendBrandedEmail({
      to: process.env.EMAIL as string,
      subject: `New Shop Registration: ${shopName}`,
      html: adminHtml,
      text: `New shop registration by ${ownerName} (${ownerEmail}) for ${shopName}`,
      replyTo: ownerEmail,
    });
    console.log('Shop registration email sent successfully to admin');

    // Send confirmation to shop owner
    const ownerHtml = renderBrandedEmail({
      title: 'Your shop is under review',
      preheader: `We received your registration for ${shopName}`,
      bodyHtml: `
        <p style="margin:0 0 12px 0; color:#7f1d1d;">Dear ${ownerName},</p>
        <p style="margin:0 0 12px 0; color:#7f1d1d;">Thank you for registering your shop <strong>${shopName}</strong> on ConnectCom. Your application is currently <strong>pending review</strong>. We will notify you once it is approved.</p>
        <div style="text-align:center; margin-top:16px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://connectcom.com'}/vendor" style="background:#7f1d1d;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;margin-right:8px;">Go to Dashboard</a>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://connectcom.com'}/contact" style="background:transparent;color:#7f1d1d;padding:10px 18px;border:1px solid #7f1d1d;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;">Contact Support</a>
        </div>
        <p style="text-align:center;margin-top:16px;color:#b91c1c;font-size:14px;">Best regards,<br/>The ConnectCom Team</p>
      `,
    });

    if (ownerEmail) {
      await sendBrandedEmail({
        to: ownerEmail,
        subject: `We received your shop registration: ${shopName}`,
        html: ownerHtml,
      });
      console.log(`Shop registration confirmation sent to owner ${ownerEmail}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending shop registration email:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email.' 
    }, { status: 500 });
  }
}