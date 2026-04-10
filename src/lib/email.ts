import { Resend } from "resend";

export interface SendTrackedImageArgs {
  to: string;
  from?: string;
  subject: string;
  body: string;
  trackedImageUrl: string;
  pixelUrl: string;
}

export async function sendTrackedImageEmail(args: SendTrackedImageArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(apiKey);
  const fromAddr = args.from ?? "Pixi <onboarding@resend.dev>";

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111;">
      <p style="font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(
        args.body,
      )}</p>
      <p style="margin-top:24px;">
        <img src="${args.trackedImageUrl}" alt="attached image" style="max-width:100%;border-radius:8px;" />
      </p>
      <img src="${args.pixelUrl}" width="1" height="1" style="display:block;" alt="" />
    </div>
  `;

  return resend.emails.send({
    from: fromAddr,
    to: args.to,
    subject: args.subject,
    html,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
