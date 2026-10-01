/**
 * SA Glam & Grace - Automated Admin Order Email Dispatcher
 * Dispatches real-time order alerts directly to saconsultantandstaffing1@gmail.com
 * Powered by Supabase send-email Edge Function + Resend API
 */

(function () {
  const PRIMARY_ADMIN_EMAIL = 'saconsultantandstaffing1@gmail.com';
  const BACKUP_ADMIN_EMAIL = 'sajaruthmahjabeen@gmail.com';

  const SUPABASE_FUNC_URL = 'https://hqonpbkoutnkffjtshxw.supabase.co/functions/v1/send-email';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxb25wYmtvdXRua2ZmanRzaHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MDE4NTUsImV4cCI6MjA5MDI3Nzg1NX0.jN5AYaZRse3SEA51XTh1TL-d0hDb48jLXIkxH3iQN-k';
  const RESEND_API_KEY = (typeof window !== 'undefined' && window.__RESEND_API_KEY) ? window.__RESEND_API_KEY : '';

  function buildLuxuryOrderEmailHtml(data) {
    const orderId = data.orderId || ('ORD-' + Math.floor(1000 + Math.random() * 9000));
    const custName = data.customerName || 'Valued Customer';
    const custEmail = data.customerEmail || 'N/A';
    const custPhone = data.customerPhone || 'N/A';
    const address = data.shippingAddress || 'India';
    const items = data.itemsDesc || 'Luxury Garments';
    const total = data.totalAmount || '₹3,499';
    const payment = data.paymentMethod || 'UPI / Online';
    const dateStr = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Storefront Order: ${orderId}</title>
</head>
<body style="margin:0; padding:20px; background-color:#f6f3ee; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#221d19;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e7ded0; box-shadow:0 12px 30px rgba(0,0,0,0.06);">
    
    <!-- LUXURY HEADER -->
    <tr>
      <td style="background:linear-gradient(135deg, #181412 0%, #2a201c 100%); padding:32px 28px; text-align:center; border-bottom:3px solid #d4af37;">
        <span style="display:inline-block; font-size:11px; letter-spacing:3px; text-transform:uppercase; color:#d4af37; font-weight:700; margin-bottom:6px;">SA GLAM &amp; GRACE</span>
        <h1 style="color:#ffffff; margin:0 0 8px; font-size:24px; font-weight:600; letter-spacing:0.5px;">New Storefront Order Received!</h1>
        <div style="display:inline-block; background:rgba(212,175,55,0.18); border:1px solid #d4af37; color:#f6e05e; padding:5px 14px; border-radius:20px; font-size:13px; font-weight:700; font-family:monospace;">
          ${orderId}
        </div>
      </td>
    </tr>

    <!-- SUMMARY PILL -->
    <tr>
      <td style="padding:24px 28px 12px;">
        <div style="background:#faf7f2; border:1px dashed #d4af37; border-radius:8px; padding:14px 18px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <span style="font-size:11px; text-transform:uppercase; color:#854d0e; font-weight:700; display:block; letter-spacing:0.5px;">Total Order Value</span>
            <strong style="font-size:22px; color:#b45309;">${total}</strong>
          </div>
          <div style="text-align:right;">
            <span style="font-size:11px; color:#6b7280; display:block;">Payment Method</span>
            <strong style="font-size:14px; color:#181412;">${payment}</strong>
          </div>
        </div>
      </td>
    </tr>

    <!-- CUSTOMER & DELIVERY INFO -->
    <tr>
      <td style="padding:12px 28px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
          <tr>
            <td style="background:#f9fafb; padding:10px 16px; border-bottom:1px solid #e5e7eb; font-weight:700; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#4b5563;">
              Customer &amp; Shipping Details
            </td>
          </tr>
          <tr>
            <td style="padding:14px 16px; font-size:13px; line-height:1.7;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="2">
                <tr>
                  <td width="30%" style="color:#6b7280;">Recipient:</td>
                  <td style="color:#111827; font-weight:600;">${custName}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;">Email:</td>
                  <td><a href="mailto:${custEmail}" style="color:#b45309; text-decoration:none; font-weight:600;">${custEmail}</a></td>
                </tr>
                <tr>
                  <td style="color:#6b7280;">Phone Number:</td>
                  <td style="color:#111827; font-weight:600;">${custPhone}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280; vertical-align:top;">Delivery Address:</td>
                  <td style="color:#111827; font-weight:500;">${address}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;">Order Placed:</td>
                  <td style="color:#374151;">${dateStr} (IST)</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ORDERED GARMENTS -->
    <tr>
      <td style="padding:12px 28px 24px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
          <tr>
            <td style="background:#f9fafb; padding:10px 16px; border-bottom:1px solid #e5e7eb; font-weight:700; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#4b5563;">
              Ordered Garments &amp; Inventory Breakdown
            </td>
          </tr>
          <tr>
            <td style="padding:16px; font-size:13px; color:#374151; line-height:1.6; background:#fffdfa;">
              <p style="margin:0 0 8px; font-weight:600; color:#181412;">Item Details:</p>
              <div style="background:#ffffff; border:1px solid #eedec3; border-radius:6px; padding:12px 14px; font-size:13px; color:#4a3f35;">
                ${items}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- FOOTER ACTION -->
    <tr>
      <td style="background:#faf7f2; padding:20px 28px; text-align:center; border-top:1px solid #e7ded0;">
        <p style="margin:0 0 12px; font-size:12px; color:#6b7280;">
          This automatic order alert was dispatched from the <strong>SA Glam &amp; Grace</strong> luxury storefront.
        </p>
        <span style="font-size:11px; color:#9ca3af;">Recipient: ${PRIMARY_ADMIN_EMAIL}</span>
      </td>
    </tr>

  </table>
</body>
</html>
    `;
  }

  /**
   * Dispatches the order email to saconsultantandstaffing1@gmail.com
   */
  window.sendAdminOrderNotificationEmail = async function (orderData) {
    if (!orderData) return { success: false, error: 'No order data provided' };

    const orderId = orderData.orderId || ('ORD-' + Math.floor(1000 + Math.random() * 9000));
    const custName = orderData.customerName || 'Customer';
    const total = orderData.totalAmount || '₹3,499';
    const subject = `🛍️ [NEW ORDER] ${orderId} - ${total} from ${custName}`;
    const htmlBody = buildLuxuryOrderEmailHtml(orderData);

    console.log(`[SA Email Dispatcher] Sending order alert for ${orderId} to ${PRIMARY_ADMIN_EMAIL}...`);

    let sentSuccessfully = false;

    // 1. PRIMARY DISPATCH: Supabase Edge Function send-email (Delivers directly to saconsultantandstaffing1@gmail.com)
    try {
      const resp = await fetch(SUPABASE_FUNC_URL, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipients: [PRIMARY_ADMIN_EMAIL],
          subject: subject,
          html: htmlBody
        })
      });

      if (resp.ok) {
        const resJson = await resp.json().catch(() => ({}));
        console.log('[SA Email Dispatcher] Primary email delivered successfully:', resJson);
        sentSuccessfully = true;
      } else {
        const errText = await resp.text().catch(() => '');
        console.warn('[SA Email Dispatcher] Primary edge function status:', resp.status, errText);
      }
    } catch (err) {
      console.warn('[SA Email Dispatcher] Primary edge function error:', err);
    }

    // 2. BACKUP DISPATCH: Resend API (Delivers to registered account sajaruthmahjabeen@gmail.com)
    try {
      const resendResp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + RESEND_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'SA Glam & Grace <onboarding@resend.dev>',
          to: [BACKUP_ADMIN_EMAIL],
          subject: subject,
          html: htmlBody
        })
      });

      if (resendResp.ok) {
        const resendJson = await resendResp.json().catch(() => ({}));
        console.log('[SA Email Dispatcher] Backup email via Resend delivered successfully:', resendJson);
        sentSuccessfully = true;
      }
    } catch (resendErr) {
      console.warn('[SA Email Dispatcher] Resend backup notice:', resendErr);
    }

    return { success: sentSuccessfully };
  };

  console.log('[SA Glam & Grace] Automated Admin Order Email Dispatcher loaded for ' + PRIMARY_ADMIN_EMAIL);
})();
