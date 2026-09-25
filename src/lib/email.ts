// Transactional email via Resend's HTTP API (no SDK needed).
//
// Env: RESEND_API_KEY and EMAIL_FROM (e.g. "Blissynest <orders@blissynest.com>",
// on a domain verified in Resend). When either is missing — local dev, or
// before the domain is verified — emails are NOT sent; instead the message is
// printed to the server console so flows like password reset can still be
// exercised end to end. sendEmail never throws: a failed email must never
// break an order or a sign-up.

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail(message: EmailMessage): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.log(
      `[email not configured — printing instead]\nTo: ${message.to}\nSubject: ${message.subject}\n\n${message.text}\n`
    );
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.error(`[email] Resend rejected "${message.subject}" to ${message.to}: ${res.status} ${await res.text()}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[email] failed to send "${message.subject}" to ${message.to}`, err);
    return false;
  }
}
