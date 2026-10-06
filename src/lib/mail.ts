import nodemailer from 'nodemailer';

export const SALES_EMAIL = process.env.SALES_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL || 'sales@novaauto.co.nz';
export const ADMIN_EMAIL = SALES_EMAIL;


// Create transporter if SMTP environment variables are configured
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return null;
}

export interface InquiryNotificationPayload {
  type: 'Vehicle Inquiry' | 'Test Drive Request' | 'Trade-In Valuation' | 'Finance Pre-Approval' | 'General Contact';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message?: string;
  vehicleDetails?: {
    make?: string;
    model?: string;
    year?: number;
    stockNumber?: string;
    price?: number;
  };
  extraDetails?: Record<string, string | number | undefined | null>;
}

export async function sendInquiryNotification(payload: InquiryNotificationPayload): Promise<boolean> {
  const { type, customerName, customerEmail, customerPhone, message, vehicleDetails, extraDetails } = payload;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://novaauto.co.nz';

  const subject = `[NOVA CARS] New ${type} from ${customerName}`;

  const vehicleSummary = vehicleDetails?.make
    ? `${vehicleDetails.year || ''} ${vehicleDetails.make} ${vehicleDetails.model} ${
        vehicleDetails.stockNumber ? `(Stock: ${vehicleDetails.stockNumber})` : ''
      }`
    : 'None / General';

  const extraRows = extraDetails
    ? Object.entries(extraDetails)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(
          ([key, value]) => `
          <tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #222; color: #999; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">${key}</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #222; color: #fff; font-size: 14px; font-weight: 600;">${value}</td>
          </tr>`
        )
        .join('')
    : '';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="background-color: #08080a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 30px 15px; color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111114; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
    <!-- Header -->
    <div style="background: linear-gradient(180deg, #18181c 0%, #111114 100%); padding: 32px 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
      <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.25em; color: #f4d410; text-transform: uppercase; margin-bottom: 6px;">Dealership Notification</div>
      <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700;">New Customer ${type}</h1>
      <p style="color: #a1a1aa; font-size: 13px; margin: 8px 0 0 0;">Received through Nova Cars public portal</p>
    </div>

    <!-- Body Content -->
    <div style="padding: 30px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #222; color: #999; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; width: 35%;">Customer Name</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #222; color: #fff; font-size: 14px; font-weight: 600;">${customerName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #222; color: #999; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Email Address</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #222; color: #f4d410; font-size: 14px; font-weight: 600;">
            <a href="mailto:${customerEmail}" style="color: #f4d410; text-decoration: none;">${customerEmail}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #222; color: #999; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Phone Number</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #222; color: #fff; font-size: 14px; font-weight: 600;">
            <a href="tel:${customerPhone}" style="color: #fff; text-decoration: none;">${customerPhone}</a>
          </td>
        </tr>
        ${
          vehicleDetails?.make
            ? `<tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #222; color: #999; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Vehicle Inquired</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #222; color: #fff; font-size: 14px; font-weight: 600;">${vehicleSummary}</td>
          </tr>`
            : ''
        }
        ${extraRows}
      </table>

      ${
        message
          ? `
      <div style="background-color: #0c0c0f; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 18px; margin-bottom: 26px;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 8px; font-weight: 700;">Customer Note / Message</div>
        <div style="color: #e4e4e7; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
      </div>`
          : ''
      }

      <!-- CTA -->
      <div style="text-align: center; margin-top: 30px;">
        <a href="${siteUrl}/admin" style="display: inline-block; background-color: #f4d410; color: #000; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; padding: 14px 28px; border-radius: 10px; text-decoration: none; box-shadow: 0 8px 20px rgba(244,212,16,0.3);">
          Open Admin Panel
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #0c0c0f; padding: 18px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: #71717a;">
      This notification was automatically dispatched to <strong>${SALES_EMAIL}</strong>.<br/>
      Nova Cars Auckland &bull; 298B Great South Road, Manurewa, Auckland
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
[NOVA CARS] New ${type}
----------------------------------------
Customer: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone}
Vehicle: ${vehicleSummary}
${message ? `\nMessage:\n${message}\n` : ''}
Admin Portal: ${siteUrl}/admin
Notification sent to: ${SALES_EMAIL}
  `.trim();

  const transporter = getTransporter();

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Nova Cars Website" <${process.env.SMTP_FROM || SALES_EMAIL}>`,
        to: SALES_EMAIL,
        replyTo: customerEmail,
        subject,
        text: textContent,
        html: htmlContent,
      });
      console.log(`[EMAIL DISPATCHED] Successfully sent notification to ${SALES_EMAIL}`);
      return true;
    } catch (err: any) {
      console.error(`[EMAIL ERROR] Failed sending to ${SALES_EMAIL}:`, err.message);
      return false;
    }
  } else {
    // If SMTP credentials not configured in environment yet, log detailed record
    console.log(`[INQUIRY RECORDED] New ${type} saved to DB and prepared for ${SALES_EMAIL}`);
    console.log(textContent);
    return true;
  }
}
