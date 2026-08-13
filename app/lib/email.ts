import { Resend } from "resend";
import { logger } from "@/app/lib/logger";

const EMAIL_FROM = process.env.EMAIL_FROM ?? "Bammbo Rafting <onboarding@resend.dev>";

let client: Resend | null = null;

function getClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export async function sendEmail(params: { to: string; subject: string; html: string }) {
  const resend = getClient();
  if (!resend) {
    logger.warn("email_dilewati_no_api_key", { to: params.to, subject: params.subject });
    return { ok: false as const, reason: "no_api_key" as const };
  }

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  if (error) {
    logger.error("email_gagal_terkirim", { to: params.to, subject: params.subject, error: error.message });
    return { ok: false as const, reason: "send_failed" as const };
  }

  logger.info("email_terkirim", { to: params.to, subject: params.subject });
  return { ok: true as const };
}
