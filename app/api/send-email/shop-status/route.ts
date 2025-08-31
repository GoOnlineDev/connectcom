export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { shopName, shopOwnerEmail, shopOwnerName, newStatus, adminNotes, previousStatus } = await req.json();

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

  // Email to shop owner about status change
  const ownerMailOptions = {
    from: `"ConnectCom Platform" <${process.env.EMAIL}>`,
    to: shopOwnerEmail,
    subject: `${statusInfo.title} - ${shopName}`,
    text: `
Dear ${shopOwnerName},

${statusInfo.message}

Shop: ${shopName}
Previous Status: ${previousStatus}
New Status: ${newStatus}

${statusInfo.action}

${adminNotes ? `Admin Notes: ${adminNotes}` : ''}

If you have any questions, please don't hesitate to contact our support team.

Best regards,
The ConnectCom Team
    `,
    html: `
      <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #7f1d1d; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="cid:${logoCid}" alt="ConnectCom Logo" style="height: 60px; margin-bottom: 16px;" />
          <h1 style="color: ${statusInfo.color}; margin: 0; font-size: 24px; font-weight: bold;">${statusInfo.title}</h1>
        </div>
        
        <div style="background: #fdf2f2; border: 1px solid #f9d4d4; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <p style="color: #7f1d1d; margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">Dear ${shopOwnerName},</p>
          <p style="color: #7f1d1d; margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">${statusInfo.message}</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #7f1d1d; width: 40%;">Shop Name:</td>
              <td style="padding: 8px 0; color: #b91c1c;">${shopName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #7f1d1d;">Previous Status:</td>
              <td style="padding: 8px 0; color: #b91c1c; text-transform: capitalize;">${previousStatus.replace('_', ' ')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #7f1d1d;">New Status:</td>
              <td style="padding: 8px 0; color: ${statusInfo.color}; text-transform: capitalize; font-weight: 600;">${newStatus.replace('_', ' ')}</td>
            </tr>
          </table>
          
          <p style="color: #7f1d1d; margin: 16px 0; font-size: 16px; line-height: 1.6;">${statusInfo.action}</p>
        </div>

        ${adminNotes ? `
        <div style="background: #faf6ed; border: 1px solid #f4ecd8; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h3 style="color: #7f1d1d; margin: 0 0 8px 0; font-size: 16px;">Admin Notes</h3>
          <p style="color: #8a6f37; margin: 0; line-height: 1.6;">${adminNotes}</p>
        </div>
        ` : ''}

        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #f9d4d4;">
          <p style="color: #7f1d1d; margin-bottom: 16px;">Need help? Contact our support team.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/vendor" 
             style="background: #7f1d1d; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block; margin-right: 12px;">
            Go to Dashboard
          </a>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact" 
             style="background: transparent; color: #7f1d1d; padding: 12px 24px; border: 1px solid #7f1d1d; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">
            Contact Support
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
    await transporter.sendMail(ownerMailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending shop status change email:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email.' }, { status: 500 });
  }
}
