// Transactional email over HTTP (no SDK needed).
//
// Provider, in order of preference:
//   1. ZeptoMail (Zoho): ZEPTOMAIL_TOKEN and EMAIL_FROM. The token is the
//      "Send Mail Token" from the ZeptoMail agent's SMTP/API tab. Set
//      ZEPTOMAIL_REGION to where your ZeptoMail account lives: "in" (India,
//      the default), "com" (US), "eu", "com.au", "jp", "ca" or "sa".
//   2. Resend: RESEND_API_KEY and EMAIL_FROM.
//
// EMAIL_FROM is e.g. "Blissynest <orders@blissynest.com>", on a domain that
// has been verified with the provider. When no provider is configured (local
// dev, or before the domain is verified) emails are NOT sent; the message is
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

type Provider = "zeptomail" | "resend" | null;

function activeProvider(): Provider {
  if (!process.env.EMAIL_FROM) return null;
  if (process.env.ZEPTOMAIL_TOKEN) return "zeptomail";
  if (process.env.RESEND_API_KEY) return "resend";
  return null;
}

export function isEmailConfigured(): boolean {
  return activeProvider() !== null;
}

// "Blissynest <orders@blissynest.com>" -> { name, address }
function parseAddress(value: string): { name?: string; address: string } {
  const match = value.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (match) return { name: match[1].replace(/^"|"$/g, "") || undefined, address: match[2].trim() };
  return { address: value.trim() };
}

async function sendViaZeptoMail(message: EmailMessage): Promise<boolean> {
  const region = (process.env.ZEPTOMAIL_REGION || "in").replace(/^\./, "");
  const url = process.env.ZEPTOMAIL_API_URL || `https://api.zeptomail.${region}/v1.1/email`;
  // The token is shown in the ZeptoMail console with its "Zoho-enczapikey"
  // prefix; accept it with or without.
  const raw = process.env.ZEPTOMAIL_TOKEN!.trim();
  const authorization = /^Zoho-enczapikey\s/i.test(raw) ? raw : `Zoho-enczapikey ${raw}`;
  const from = parseAddress(process.env.EMAIL_FROM!);
  const replyTo = message.replyTo ? parseAddress(message.replyTo) : null;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: authorization,
    },
    body: JSON.stringify({
      from: { address: from.address, ...(from.name ? { name: from.name } : {}) },
      to: [{ email_address: { address: message.to } }],
      subject: message.subject,
      htmlbody: message.html,
      textbody: message.text,
      ...(replyTo ? { reply_to: [{ address: replyTo.address, ...(replyTo.name ? { name: replyTo.name } : {}) }] } : {}),
    }),
  });
  if (!res.ok) {
    console.error(`[email] ZeptoMail rejected "${message.subject}" to ${message.to}: ${res.status} ${await res.text()}`);
    return false;
  }
  return true;
}

async function sendViaResend(message: EmailMessage): Promise<boolean> {
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
}

export async function sendEmail(message: EmailMessage): Promise<boolean> {
  const provider = activeProvider();
  if (!provider) {
    console.log(
      `[email not configured, printing instead]\nTo: ${message.to}\nSubject: ${message.subject}\n\n${message.text}\n`
    );
    return false;
  }

  try {
    return provider === "zeptomail" ? await sendViaZeptoMail(message) : await sendViaResend(message);
  } catch (err) {
    console.error(`[email] failed to send "${message.subject}" to ${message.to}`, err);
    return false;
  }
}
