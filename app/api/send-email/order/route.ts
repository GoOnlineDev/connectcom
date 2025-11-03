export const dynamic = "force-dynamic";
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { renderBrandedEmail, sendBrandedEmail, verifyEmailTransporter, getEmailTransporter } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const {
      orderNumber,
      shopName,
      shopOwnerEmail,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      deliveryCity,
      deliveryNotes,
      items,
      subtotal,
      totalAmount,
      paymentMethod,
      customerNotes,
    } = await req.json();

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
      console.log('SMTP server is ready for order emails');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return NextResponse.json({ 
        success: false, 
        error: 'Email service connection failed' 
      }, { status: 500 });
    }

    // Format items for email
    const itemsHtml = items.map((item: any) => {
      let itemDetails = `
        <tr>
          <td style="padding:8px 0; color:#b91c1c;">${item.itemName}</td>
          <td style="padding:8px 0; text-align:center; color:#b91c1c;">${item.quantity}</td>
          <td style="padding:8px 0; text-align:right; color:#b91c1c;">UG ${item.price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
          <td style="padding:8px 0; text-align:right; color:#b91c1c; font-weight:600;">UG ${item.total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
        </tr>
      `;
      
      if (item.itemType === 'service' && item.serviceDetails) {
        const details = item.serviceDetails;
        itemDetails += `
          <tr>
            <td colspan="4" style="padding:4px 0 8px 16px; color:#8a6f37; font-size:13px;">
              ${details.selectedDate ? `📅 Date: ${details.selectedDate}` : ''}
              ${details.selectedTime ? ` | ⏰ Time: ${details.selectedTime}` : ''}
              ${details.notes ? ` | 📝 Notes: ${details.notes}` : ''}
            </td>
          </tr>
        `;
      }
      
      return itemDetails;
    }).join('');

    // Email to Shop Owner
    const shopOwnerHtml = renderBrandedEmail({
      title: '🛒 New Order Received',
      preheader: `New order ${orderNumber} from ${customerName}`,
      bodyHtml: `
        <p style="margin:0 0 16px 0; color:#7f1d1d; font-size:16px; font-weight:600;">
          You have received a new order!
        </p>
        
        <div style="background:#faf6ed; border:1px solid #f4ecd8; border-radius:8px; padding:16px; margin-bottom:16px;">
          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0; font-weight:600; width:35%; color:#7f1d1d;">Order Number:</td>
              <td style="padding:6px 0; color:#b91c1c; font-weight:600;">${orderNumber}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; font-weight:600; color:#7f1d1d;">Customer Name:</td>
              <td style="padding:6px 0; color:#b91c1c;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; font-weight:600; color:#7f1d1d;">Customer Email:</td>
              <td style="padding:6px 0; color:#b91c1c;"><a href="mailto:${customerEmail}" style="color:#b91c1c;">${customerEmail}</a></td>
            </tr>
            <tr>
              <td style="padding:6px 0; font-weight:600; color:#7f1d1d;">Customer Phone:</td>
              <td style="padding:6px 0; color:#b91c1c;"><a href="tel:${customerPhone}" style="color:#b91c1c;">${customerPhone}</a></td>
            </tr>
          </table>
        </div>

        <h3 style="margin:16px 0 8px 0; font-size:16px; color:#7f1d1d;">Order Items</h3>
        <table style="width:100%; border-collapse:collapse; margin-bottom:16px;">
          <thead>
            <tr style="background:#f4ecd8; border-bottom:2px solid #f4ecd8;">
              <th style="padding:10px; text-align:left; color:#7f1d1d; font-weight:600;">Item</th>
              <th style="padding:10px; text-align:center; color:#7f1d1d; font-weight:600;">Qty</th>
              <th style="padding:10px; text-align:right; color:#7f1d1d; font-weight:600;">Price</th>
              <th style="padding:10px; text-align:right; color:#7f1d1d; font-weight:600;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="background:#faf6ed; border:1px solid #f4ecd8; border-radius:8px; padding:16px; margin-bottom:16px;">
          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0; font-weight:600; color:#7f1d1d; text-align:right;">Subtotal:</td>
              <td style="padding:8px 0; color:#b91c1c; text-align:right; font-weight:600; width:120px;">UG ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
            </tr>
            <tr style="border-top:2px solid #f4ecd8;">
              <td style="padding:8px 0; font-weight:700; color:#7f1d1d; text-align:right; font-size:16px;">Total Amount:</td>
              <td style="padding:8px 0; color:#b91c1c; text-align:right; font-weight:700; font-size:16px;">UG ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
            </tr>
          </table>
        </div>

        <h3 style="margin:16px 0 8px 0; font-size:16px; color:#7f1d1d;">Delivery Information</h3>
        <div style="background:#faf6ed; border:1px solid #f4ecd8; border-radius:8px; padding:16px; margin-bottom:16px;">
          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0; font-weight:600; width:35%; color:#7f1d1d;">Address:</td>
              <td style="padding:6px 0; color:#b91c1c;">${deliveryAddress}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; font-weight:600; color:#7f1d1d;">City:</td>
              <td style="padding:6px 0; color:#b91c1c;">${deliveryCity}</td>
            </tr>
            ${deliveryNotes ? `
            <tr>
              <td style="padding:6px 0; font-weight:600; color:#7f1d1d;">Delivery Notes:</td>
              <td style="padding:6px 0; color:#8a6f37;">${deliveryNotes}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding:6px 0; font-weight:600; color:#7f1d1d;">Payment Method:</td>
              <td style="padding:6px 0; color:#b91c1c;">${paymentMethod || 'Pending'}</td>
            </tr>
          </table>
        </div>

        ${customerNotes ? `
        <h3 style="margin:16px 0 8px 0; font-size:16px; color:#7f1d1d;">Customer Notes</h3>
        <div style="background:#faf6ed; border:1px solid #f4ecd8; border-radius:8px; padding:12px; margin-bottom:16px;">
          <p style="margin:0; color:#8a6f37; line-height:1.6;">${customerNotes}</p>
        </div>
        ` : ''}

        <div style="text-align:center; margin-top:20px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://connectcom.com'}/vendor" style="background:#7f1d1d;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;">View Order in Dashboard</a>
        </div>
        
        <p style="text-align:center;margin-top:16px;color:#b91c1c;font-size:14px;">Please contact the customer to confirm the order and arrange delivery.</p>
        <p style="text-align:center;margin-top:8px;color:#8a6f37;font-size:12px;">Best regards,<br/>The ConnectCom Team</p>
      `,
    });

    await sendBrandedEmail({
      to: shopOwnerEmail,
      subject: `New Order #${orderNumber} - ${shopName}`,
      html: shopOwnerHtml,
      text: `New order ${orderNumber} from ${customerName} for ${shopName}. Total: UG ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      replyTo: customerEmail,
    });
    console.log(`Order email sent to shop owner ${shopOwnerEmail} for order ${orderNumber}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending order email:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email.' 
    }, { status: 500 });
  }
}

