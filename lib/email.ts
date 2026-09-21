import nodemailer from 'nodemailer';

// ─────────────────────────────────────────────────────────────────────────────
// Centralized Email Notification Service — LYCARONZ DESIGNS
// All emails are sent server-side only. No credentials in client code.
// ─────────────────────────────────────────────────────────────────────────────

const EMAIL_TO = process.env.EMAIL_TO || 'info.lycaronz@gmail.com';
const EMAIL_FROM = process.env.EMAIL_FROM || `"LYCARONZ DESIGNS" <${process.env.SMTP_USER || 'info.lycaronz@gmail.com'}>`;

// Build Nodemailer transporter — reused across requests
function createTransporter() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ─── Timezone helper ─────────────────────────────────────────────────────────
function formatEAT(date: Date): string {
  return date.toLocaleString('en-GB', {
    timeZone: 'Africa/Kampala',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }) + ' EAT';
}

// ─── Shared HTML layout ───────────────────────────────────────────────────────
function emailWrapper(title: string, badgeColor: string, badgeLabel: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#F4F4F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#0A0D1F;padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:20px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">
                      LYCARONZ <span style="color:#D4AF37;">DESIGNS</span>
                    </p>
                    <p style="margin:4px 0 0;font-size:11px;font-weight:700;color:#9CA3AF;letter-spacing:2px;text-transform:uppercase;">
                      Haute Couture &amp; Atelier · Kampala
                    </p>
                  </td>
                  <td align="right">
                    <span style="display:inline-block;background:${badgeColor};color:#fff;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;padding:5px 14px;border-radius:999px;">
                      ${badgeLabel}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title bar -->
          <tr>
            <td style="background:#D4AF37;padding:12px 32px;">
              <p style="margin:0;font-size:13px;font-weight:900;color:#0A0D1F;text-transform:uppercase;letter-spacing:1px;">
                ${title}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                This notification was generated automatically by LYCARONZ DESIGNS.<br/>
                Jemba Plaza, Kampala, Uganda &nbsp;·&nbsp; info.lycaronz@gmail.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Row helper for email data table ─────────────────────────────────────────
function row(label: string, value: string, highlight = false): string {
  return `<tr>
    <td style="padding:10px 14px;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#6B7280;width:130px;background:#F9FAFB;border-bottom:1px solid #F3F4F6;">${label}</td>
    <td style="padding:10px 14px;font-size:13px;font-weight:${highlight ? '900' : '600'};color:${highlight ? '#0A0D1F' : '#374151'};background:#fff;border-bottom:1px solid #F3F4F6;">${value}</td>
  </tr>`;
}

// ─── Appointment notification ─────────────────────────────────────────────────
export interface AppointmentEmailData {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  date: Date;
  service: string;
  notes?: string | null;
  status: string;
  createdAt: Date;
}

export async function sendAppointmentNotification(appt: AppointmentEmailData): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[EMAIL] SMTP not configured — appointment notification skipped. ID:', appt.id);
    return;
  }

  const ref = `APT-${appt.id.slice(-8).toUpperCase()}`;
  const preferredDate = formatEAT(appt.date);
  const submittedAt = formatEAT(appt.createdAt);

  const body = `
    <p style="margin:0 0 24px;font-size:15px;font-weight:700;color:#374151;">
      A new fitting appointment has been requested. Please review and confirm with the customer.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      ${row('Reference', ref, true)}
      ${row('Customer', appt.name, true)}
      ${row('Phone / WhatsApp', appt.phone)}
      ${row('Email', appt.email || '—')}
      ${row('Service', appt.service, true)}
      ${row('Preferred Date', preferredDate, true)}
      ${row('Notes', appt.notes ? appt.notes.replace(/\n/g, '<br/>') : '—')}
      ${row('Status', appt.status.toUpperCase())}
      ${row('Submitted', submittedAt)}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/admin/appointments"
             style="display:inline-block;background:#0A0D1F;color:#D4AF37;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1px;padding:12px 24px;border-radius:8px;text-decoration:none;">
            View in Admin Dashboard →
          </a>
        </td>
        ${appt.phone ? `<td align="right">
          <a href="https://wa.me/${appt.phone.replace(/[^0-9]/g, '')}"
             style="display:inline-block;background:#25D366;color:#fff;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1px;padding:12px 24px;border-radius:8px;text-decoration:none;">
            WhatsApp Customer →
          </a>
        </td>` : ''}
      </tr>
    </table>
  `;

  const html = emailWrapper(
    'New Appointment Request',
    '#D97706',
    'New Appointment',
    body
  );

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: EMAIL_TO,
    replyTo: appt.email || undefined,
    subject: `New Appointment — ${appt.name} — LYCARONZ DESIGNS`,
    text: `New Appointment Request\n\nRef: ${ref}\nCustomer: ${appt.name}\nPhone: ${appt.phone}\nEmail: ${appt.email || '—'}\nService: ${appt.service}\nPreferred Date: ${preferredDate}\nNotes: ${appt.notes || '—'}\nStatus: ${appt.status}\nSubmitted: ${submittedAt}\n\nView: ${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/admin/appointments`,
    html,
  });

  console.log(`[EMAIL] Appointment notification sent for ${ref} (${appt.name})`);
}

// ─── Contact/Inquiry notification ────────────────────────────────────────────
export interface InquiryEmailData {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message?: string | null;
  source?: string;
  refId?: string;
}

export async function sendInquiryNotification(inquiry: InquiryEmailData): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[EMAIL] SMTP not configured — inquiry notification skipped. From:', inquiry.email);
    return;
  }

  const ref = inquiry.refId || `INQ-${Date.now().toString(36).toUpperCase()}`;
  const submittedAt = formatEAT(new Date());

  const body = `
    <p style="margin:0 0 24px;font-size:15px;font-weight:700;color:#374151;">
      A new customer inquiry has been submitted via the ${inquiry.source || 'contact form'}.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      ${row('Reference', ref, true)}
      ${row('Customer', inquiry.name, true)}
      ${row('Email', inquiry.email, true)}
      ${row('Phone', inquiry.phone || '—')}
      ${row('Subject', inquiry.subject || 'General Inquiry')}
      ${row('Message', inquiry.message ? inquiry.message.replace(/\n/g, '<br/>') : '—')}
      ${row('Source', inquiry.source || 'Contact Page')}
      ${row('Submitted', submittedAt)}
    </table>

    <p style="margin:0 0 20px;font-size:12px;color:#6B7280;font-style:italic;">
      💡 Reply directly to this email to respond to the customer — the Reply-To is set to their address.
    </p>

    <a href="mailto:${inquiry.email}"
       style="display:inline-block;background:#1E3A8A;color:#ffffff;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1px;padding:12px 24px;border-radius:8px;text-decoration:none;">
      Reply to ${inquiry.name} →
    </a>
  `;

  const html = emailWrapper(
    'New Customer Inquiry',
    '#1E3A8A',
    'New Inquiry',
    body
  );

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: EMAIL_TO,
    replyTo: inquiry.email,
    subject: `New Customer Inquiry — ${inquiry.name} — LYCARONZ DESIGNS`,
    text: `New Customer Inquiry\n\nRef: ${ref}\nCustomer: ${inquiry.name}\nEmail: ${inquiry.email}\nPhone: ${inquiry.phone || '—'}\nSubject: ${inquiry.subject || 'General Inquiry'}\nMessage: ${inquiry.message || '—'}\nSource: ${inquiry.source || 'Contact Page'}\nSubmitted: ${submittedAt}`,
    html,
  });

  console.log(`[EMAIL] Inquiry notification sent for ${ref} (${inquiry.email})`);
}

// ─── Product order/inquiry notification ──────────────────────────────────────
export interface OrderEmailData {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  message?: string | null;
  productName: string;
  productPrice?: number | null;
  productCategory?: string;
  createdAt: Date;
}

export async function sendOrderNotification(order: OrderEmailData): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[EMAIL] SMTP not configured — order notification skipped. ID:', order.id);
    return;
  }

  const ref = `ORD-${order.id.slice(-8).toUpperCase()}`;
  const submittedAt = formatEAT(order.createdAt);
  const priceStr = order.productPrice && order.productPrice > 0
    ? `UGX ${order.productPrice.toLocaleString()}`
    : 'Custom Quote';

  const body = `
    <p style="margin:0 0 24px;font-size:15px;font-weight:700;color:#374151;">
      A customer has submitted an inquiry about a product from your catalog.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      ${row('Reference', ref, true)}
      ${row('Product', order.productName, true)}
      ${row('Category', order.productCategory || '—')}
      ${row('Listed Price', priceStr)}
      ${row('Customer', order.name, true)}
      ${row('Phone / WhatsApp', order.phone)}
      ${row('Email', order.email || '—')}
      ${row('Message', order.message ? order.message.replace(/\n/g, '<br/>') : '—')}
      ${row('Submitted', submittedAt)}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/admin/orders"
             style="display:inline-block;background:#0A0D1F;color:#D4AF37;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1px;padding:12px 24px;border-radius:8px;text-decoration:none;">
            View in Admin Dashboard →
          </a>
        </td>
        ${order.phone ? `<td align="right">
          <a href="https://wa.me/${order.phone.replace(/[^0-9]/g, '')}"
             style="display:inline-block;background:#25D366;color:#fff;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1px;padding:12px 24px;border-radius:8px;text-decoration:none;">
            WhatsApp Customer →
          </a>
        </td>` : ''}
      </tr>
    </table>
  `;

  const html = emailWrapper(
    'New Product Inquiry',
    '#059669',
    'New Order',
    body
  );

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: EMAIL_TO,
    replyTo: order.email || undefined,
    subject: `New Product Inquiry — ${order.productName} — LYCARONZ DESIGNS`,
    text: `New Product Inquiry\n\nRef: ${ref}\nProduct: ${order.productName} (${priceStr})\nCustomer: ${order.name}\nPhone: ${order.phone}\nEmail: ${order.email || '—'}\nMessage: ${order.message || '—'}\nSubmitted: ${submittedAt}\n\nView: ${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/admin/orders`,
    html,
  });

  console.log(`[EMAIL] Order notification sent for ${ref} (${order.productName})`);
}
