export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

    // Set up transporter with improved configuration
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // use TLS
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
      debug: process.env.NODE_ENV === 'development', // Enable debug in development
      logger: process.env.NODE_ENV === 'development', // Enable logging in development
    });

    // Verify SMTP connection
    try {
      await transporter.verify();
      console.log('SMTP server is ready to take our messages');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return NextResponse.json({ 
        success: false, 
        error: 'Email service connection failed' 
      }, { status: 500 });
    }

    // Email to Admin about new shop registration (no attachments to avoid path issues)
    const adminMailOptions = {
      from: `"ConnectCom Platform" <${process.env.EMAIL}>`,
      to: process.env.EMAIL,
      subject: `New Shop Registration: ${shopName}`,
      replyTo: ownerEmail,
      text: `
New Shop Registration Alert

Shop Details:
- Shop Name: ${shopName}
- Shop Type: ${shopType === 'product_shop' ? 'Product Shop' : 'Service Shop'}
- Owner: ${ownerName}
- Owner Email: ${ownerEmail}
- Categories: ${categories?.join(', ') || 'None specified'}
- Description: ${description || 'No description provided'}

Contact Information:
- Email: ${contactInfo?.email || 'Not provided'}
- Phone: ${contactInfo?.phone || 'Not provided'}
- Website: ${contactInfo?.website || 'Not provided'}

Please review and approve this shop in the admin dashboard.
      `,
      html: `
        <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #7f1d1d; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #7f1d1d; margin: 0; font-size: 24px; font-weight: bold;">🏪 New Shop Registration</h1>
          </div>
          
          <div style="background: #fdf2f2; border: 1px solid #f9d4d4; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: #7f1d1d; margin: 0 0 16px 0; font-size: 20px;">Shop Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #7f1d1d; width: 30%;">Shop Name:</td>
                <td style="padding: 8px 0; color: #b91c1c;">${shopName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #7f1d1d;">Shop Type:</td>
                <td style="padding: 8px 0; color: #b91c1c;">${shopType === 'product_shop' ? 'Product Shop' : 'Service Shop'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #7f1d1d;">Owner:</td>
                <td style="padding: 8px 0; color: #b91c1c;">${ownerName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #7f1d1d;">Owner Email:</td>
                <td style="padding: 8px 0; color: #b91c1c;"><a href="mailto:${ownerEmail}" style="color: #b91c1c;">${ownerEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #7f1d1d;">Categories:</td>
                <td style="padding: 8px 0; color: #b91c1c;">${categories?.join(', ') || 'None specified'}</td>
              </tr>
            </table>
          </div>

          ${description ? `
          <div style="background: #faf6ed; border: 1px solid #f4ecd8; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <h3 style="color: #7f1d1d; margin: 0 0 8px 0; font-size: 16px;">Description</h3>
            <p style="color: #8a6f37; margin: 0; line-height: 1.6;">${description}</p>
          </div>
          ` : ''}

          <div style="background: #faf6ed; border: 1px solid #f4ecd8; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <h3 style="color: #7f1d1d; margin: 0 0 12px 0; font-size: 16px;">Contact Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 4px 0; font-weight: 600; color: #7f1d1d; width: 30%;">Email:</td>
                <td style="padding: 4px 0; color: #8a6f37;">${contactInfo?.email || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-weight: 600; color: #7f1d1d;">Phone:</td>
                <td style="padding: 4px 0; color: #8a6f37;">${contactInfo?.phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-weight: 600; color: #7f1d1d;">Website:</td>
                <td style="padding: 4px 0; color: #8a6f37;">${contactInfo?.website || 'Not provided'}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <p style="color: #7f1d1d; margin-bottom: 16px;">Please review and approve this shop in the admin dashboard.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/shops/approve" 
               style="background: #7f1d1d; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">
              Review in Admin Dashboard
            </a>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(adminMailOptions);
    console.log('Shop registration email sent successfully to admin');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending shop registration email:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email.' 
    }, { status: 500 });
  }
}