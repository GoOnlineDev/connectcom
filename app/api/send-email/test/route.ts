export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    // Check environment variables
    const emailConfig = {
      EMAIL: process.env.EMAIL ? '✅ Set' : '❌ Missing',
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ? '✅ Set' : '❌ Missing',
    };

    console.log('Email Configuration Check:', emailConfig);

    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing environment variables',
        config: emailConfig
      }, { status: 500 });
    }

    // Set up transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // use TLS
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
      debug: true,
      logger: true,
    });

    // Test SMTP connection
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Email service is configured correctly',
      config: emailConfig,
      smtp: '✅ Connection verified'
    });

  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Email test failed',
      details: error
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { testEmail } = await req.json();

    if (!testEmail) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please provide a testEmail parameter' 
      }, { status: 400 });
    }

    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email service not configured' 
      }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
      debug: true,
      logger: true,
    });

    await transporter.verify();

    // Send test email
    const testMailOptions = {
      from: `"ConnectCom Test" <${process.env.EMAIL}>`,
      to: testEmail,
      subject: 'ConnectCom Email Test',
      text: 'This is a test email from ConnectCom to verify email functionality.',
      html: `
        <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #7f1d1d; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #7f1d1d; margin: 0; font-size: 24px; font-weight: bold;">🧪 ConnectCom Email Test</h1>
          </div>
          
          <div style="background: #fdf2f2; border: 1px solid #f9d4d4; border-radius: 8px; padding: 24px;">
            <p style="color: #7f1d1d; margin: 0; font-size: 16px; line-height: 1.6;">
              This is a test email from ConnectCom to verify that the email functionality is working correctly.
            </p>
            <p style="color: #8a6f37; margin: 16px 0 0 0; font-size: 14px;">
              Sent at: ${new Date().toISOString()}
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(testMailOptions);
    console.log(`✅ Test email sent successfully to ${testEmail}`);

    return NextResponse.json({ 
      success: true, 
      message: `Test email sent to ${testEmail}` 
    });

  } catch (error) {
    console.error('❌ Test email failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Test email failed' 
    }, { status: 500 });
  }
}
