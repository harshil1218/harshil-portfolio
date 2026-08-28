import nodemailer from "nodemailer";
import { ValidateAll } from "@/utils/validations/Validation";
import { Messages } from "@/utils/Message";
import { buildNotification, buildAutoReply } from "@/services/mail/MailTemplate";

/**
 * Contact form endpoint.
 *
 * This runs on the server, never in the browser. Nodemailer is a Node library
 * and cannot run client-side, and an app password shipped to the browser would
 * let any visitor send mail as you — so the credentials stay in .env.local and
 * only ever exist in this process.
 */

/* Very small in-memory throttle. Resets on redeploy, which is fine for a
   portfolio; put a real store in front of it if the traffic ever justifies it. */
const recent = new Map();
const WINDOW_MS = 60 * 1000;

function isThrottled(ip) {
  const now = Date.now();
  for (const [key, at] of recent) {
    if (now - at > WINDOW_MS) recent.delete(key);
  }
  return recent.has(ip);
}

function rememberSend(ip) {
  recent.set(ip, Date.now());
}

function getTransport() {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "MAIL_USER and MAIL_APP_PASSWORD are missing. Copy .env.example to .env.local and fill them in."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  const { name = "", email = "", phone = "", message = "", company = "" } = req.body || {};

  /* Honeypot: real people never fill a field they cannot see. Answer 200 so a
     bot gets no signal that it was caught. */
  if (company) return res.status(200).json({ message: Messages.Contact.Sent });

  /* Re-validate here — client-side rules can be bypassed entirely. */
  const result = ValidateAll({ name, email, phone, message });
  if (!result.isValid) {
    return res.status(400).json({ message: Messages.Contact.Invalid, error: result.error });
  }

  /* Checked only once the submission is genuine, so correcting a typo and
     resubmitting is never blocked. */
  if (isThrottled(ip)) {
    return res.status(429).json({ message: Messages.Contact.Throttled });
  }

  const sentAt = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  const payload = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    message: message.trim(),
    sentAt,
  };

  try {
    const transport = getTransport();
    const to = process.env.MAIL_TO || process.env.MAIL_USER;
    const from = `"harshil.dev" <${process.env.MAIL_USER}>`;

    const notification = buildNotification(payload);
    await transport.sendMail({
      from,
      to,
      replyTo: `"${payload.name}" <${payload.email}>`,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
    });

    /* The visitor's confirmation is a nicety — if it fails, their message
       still reached the inbox, so don't fail the whole request over it. */
    try {
      const reply = buildAutoReply(payload);
      await transport.sendMail({
        from,
        to: payload.email,
        subject: reply.subject,
        html: reply.html,
        text: reply.text,
      });
    } catch (replyError) {
      console.error("[contact] auto-reply failed:", replyError.message);
    }

    rememberSend(ip);
    return res.status(200).json({ message: Messages.Contact.Sent });
  } catch (error) {
    console.error("[contact] send failed:", error);
    return res.status(500).json({ message: Messages.Contact.Failed });
  }
}
