/**
 * Email templates for the contact form.
 *
 * Two are built from one submission:
 *   buildNotification — what lands in Harshil's inbox
 *   buildAutoReply    — the confirmation the visitor gets back
 *
 * Everything is inline-styled with table layout, because Gmail and Outlook
 * strip <style> blocks and ignore flex/grid. Dark mode is left alone: clients
 * that force it will invert the neutrals, and the layout still holds.
 */

const BRAND_1 = "#0B27F0";
const BRAND_2 = "#00A9F0";
const INK = "#0B0E14";
const INK_2 = "#394354";
const INK_3 = "#687385";
const LINE = "#D2DAE5";
const GROUND = "#F2F4F8";

/** Never interpolate visitor input into HTML unescaped. */
const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const nl2br = (value = "") => escapeHtml(value).replace(/\r?\n/g, "<br>");

const shell = (title, preheader, inner) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${GROUND};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${GROUND};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid ${LINE};border-radius:6px;overflow:hidden;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
          <tr>
            <td style="height:4px;background:${BRAND_1};background-image:linear-gradient(100deg,${BRAND_1},${BRAND_2});font-size:0;line-height:4px;">&nbsp;</td>
          </tr>
          ${inner}
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td align="center" style="padding:18px 8px 0;font-family:'Courier New',monospace;font-size:11px;letter-spacing:.08em;color:${INK_3};">
              harshil<span style="color:${BRAND_1};">.dev</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const row = (label, value) => `
  <tr>
    <td style="padding:0 28px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid ${GROUND};">
        <tr>
          <td style="padding:12px 0;width:88px;vertical-align:top;font-family:'Courier New',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:${INK_3};">${escapeHtml(label)}</td>
          <td style="padding:12px 0;vertical-align:top;font-size:15px;line-height:1.55;color:${INK};">${value}</td>
        </tr>
      </table>
    </td>
  </tr>`;

/** What Harshil receives. Reply-To is set to the visitor, so hitting reply works. */
export function buildNotification({ name, email, phone, message, sentAt }) {
  const inner = `
  <tr>
    <td style="padding:26px 28px 6px;">
      <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:${INK_3};">New enquiry &middot; harshil.dev</div>
      <h1 style="margin:8px 0 0;font-size:22px;line-height:1.25;color:${INK};font-weight:600;">${escapeHtml(name)} got in touch</h1>
    </td>
  </tr>
  ${row("From", `<a href="mailto:${escapeHtml(email)}" style="color:${BRAND_1};text-decoration:none;">${escapeHtml(email)}</a>`)}
  ${phone ? row("Phone", `<a href="tel:${escapeHtml(phone)}" style="color:${INK};text-decoration:none;">${escapeHtml(phone)}</a>`) : ""}
  ${row("Sent", escapeHtml(sentAt))}
  <tr>
    <td style="padding:18px 28px 4px;">
      <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:${INK_3};">Message</div>
    </td>
  </tr>
  <tr>
    <td style="padding:0 28px 24px;">
      <div style="padding:16px 18px;background:${GROUND};border-left:3px solid ${BRAND_1};border-radius:3px;font-size:15px;line-height:1.65;color:${INK_2};">${nl2br(message)}</div>
    </td>
  </tr>
  <tr>
    <td style="padding:0 28px 28px;">
      <a href="mailto:${escapeHtml(email)}" style="display:inline-block;padding:12px 20px;background:${BRAND_1};color:#FFFFFF;font-family:'Courier New',monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;border-radius:3px;">Reply to ${escapeHtml(name)}</a>
    </td>
  </tr>`;

  return {
    subject: `New enquiry from ${name} — harshil.dev`,
    html: shell("New enquiry", `${name}: ${String(message).slice(0, 90)}`, inner),
    text: [
      `New enquiry from harshil.dev`,
      ``,
      `Name:    ${name}`,
      `Email:   ${email}`,
      phone ? `Phone:   ${phone}` : null,
      `Sent:    ${sentAt}`,
      ``,
      `Message:`,
      message,
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

/** The confirmation the visitor gets, so they know it actually arrived. */
export function buildAutoReply({ name, message }) {
  const inner = `
  <tr>
    <td style="padding:26px 28px 8px;">
      <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:${INK_3};">harshil.dev</div>
      <h1 style="margin:8px 0 12px;font-size:22px;line-height:1.3;color:${INK};font-weight:600;">Thanks, ${escapeHtml(name)} &mdash; I got your message</h1>
      <p style="margin:0;font-size:15px;line-height:1.65;color:${INK_2};">
        I read everything that comes through this form and I&rsquo;ll reply within a day.
        If it&rsquo;s urgent, just reply to this email and it&rsquo;ll come straight to me.
      </p>
    </td>
  </tr>
  <tr>
    <td style="padding:18px 28px 4px;">
      <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:${INK_3};">What you sent</div>
    </td>
  </tr>
  <tr>
    <td style="padding:0 28px 26px;">
      <div style="padding:16px 18px;background:${GROUND};border-left:3px solid ${BRAND_2};border-radius:3px;font-size:14px;line-height:1.65;color:${INK_3};">${nl2br(message)}</div>
    </td>
  </tr>`;

  return {
    subject: "Thanks for getting in touch — harshil.dev",
    html: shell("Thanks for getting in touch", "I got your message and I'll reply within a day.", inner),
    text: `Thanks, ${name} — I got your message.\n\nI read everything that comes through the form and I'll reply within a day. Reply to this email if it's urgent.\n\nWhat you sent:\n${message}`,
  };
}
