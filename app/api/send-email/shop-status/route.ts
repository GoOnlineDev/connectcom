export const dynamic = "force-dynamic";
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { renderBrandedEmail, sendBrandedEmail, verifyEmailTransporter, getEmailTransporter } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { shopName, shopOwnerEmail, shopOwnerName, newStatus, adminNotes, previousStatus } = await req.json();

    // Validate required environment variables
    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
      console.error('Missing required environment variables: EMAIL or EMAIL_PASSWORD');
      return NextResponse.json({ 
        success: false, 
        error: 'Email service not configured' 
      }, { status: 500 });
    }

    // Validate required parameters
    if (!shopOwnerEmail || !shopName || !newStatus) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameters: shopOwnerEmail, shopName, or newStatus' 
      }, { status: 400 });
    }

    // Verify SMTP connection
    try {
      getEmailTransporter();
      await verifyEmailTransporter();
      console.log('SMTP server is ready for shop status email');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return NextResponse.json({ 
        success: false, 
        error: 'Email service connection failed' 
      }, { status: 500 });
    }

    // Determine email content based on status
    const getStatusMessage = (status: string) => {
      switch (status) {
        case 'active':
          return {
            title: 'Shop Approved! 🎉',
            message: 'Congratulations! Your shop has been approved and is now live on ConnectCom.',
            color: '#16a34a',
            action: 'Your shop is now visible to customers and you can start managing your products/services.',
          };
        case 'rejected':
          return {
            title: 'Shop Registration Update',
            message: 'We regret to inform you that your shop registration requires some adjustments.',
            color: '#dc2626',
            action: 'Please review the feedback below and feel free to resubmit your application.',
          };
        case 'suspended':
          return {
            title: 'Shop Status Update',
            message: 'Your shop has been temporarily suspended.',
            color: '#ea580c',
            action: 'Please contact our support team if you have any questions about this change.',
          };
        case 'pending_approval':
          return {
            title: 'Shop Under Review',
            message: 'Your shop is currently under review by our team.',
            color: '#2563eb',
            action: 'We will notify you once the review is complete.',
          };
        default:
          return {
            title: 'Shop Status Update',
            message: `Your shop status has been updated to: ${status}`,
            color: '#7f1d1d',
            action: 'Please check your shop dashboard for more details.',
          };
      }
    };

    const statusInfo = getStatusMessage(newStatus);

    // Email to shop owner about status change (no attachments to avoid path issues)
    const ownerHtml = renderBrandedEmail({
      title: statusInfo.title,
      preheader: `${shopName} status updated to ${newStatus}`,
      bodyHtml: `
        <p style="margin:0 0 12px 0; color:#7f1d1d;">Dear ${shopOwnerName},</p>
        <p style="margin:0 0 12px 0; color:#7f1d1d;">${statusInfo.message}</p>
        <table style="width:100%; border-collapse:collapse; margin:12px 0;">
          <tr><td style="padding:6px 0; font-weight:600; width:40%;">Shop Name:</td><td style="padding:6px 0; color:#b91c1c;">${shopName}</td></tr>
          <tr><td style="padding:6px 0; font-weight:600;">Previous Status:</td><td style="padding:6px 0; color:#b91c1c; text-transform:capitalize;">${previousStatus?.replace('_', ' ') || 'N/A'}</td></tr>
          <tr><td style="padding:6px 0; font-weight:600;">New Status:</td><td style="padding:6px 0; color:${statusInfo.color}; text-transform:capitalize; font-weight:600;">${newStatus.replace('_', ' ')}</td></tr>
        </table>
        ${adminNotes ? `<div style=\"margin-top:12px; padding:12px; border:1px solid #f4ecd8; border-radius:8px; color:#8a6f37;\"><strong>Admin Notes:</strong> ${adminNotes}</div>` : ''}
        <div style="text-align:center; margin-top:16px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://connectcom.com'}/vendor" style="background:#7f1d1d;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;margin-right:8px;">Go to Dashboard</a>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://connectcom.com'}/contact" style="background:transparent;color:#7f1d1d;padding:10px 18px;border:1px solid #7f1d1d;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;">Contact Support</a>
        </div>
        <p style="text-align:center;margin-top:16px;color:#b91c1c;font-size:14px;">Best regards,<br/>The ConnectCom Team</p>
      `,
    });

    await sendBrandedEmail({
      to: shopOwnerEmail,
      subject: `${statusInfo.title} - ${shopName}`,
      html: ownerHtml,
      text: `Dear ${shopOwnerName}, ${statusInfo.message}. Shop: ${shopName}. Previous: ${previousStatus}. New: ${newStatus}. ${adminNotes ? `Admin Notes: ${adminNotes}` : ''}`,
    });
    console.log(`Shop status change email sent successfully to ${shopOwnerEmail}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending shop status change email:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email.' 
    }, { status: 500 });
  }
}