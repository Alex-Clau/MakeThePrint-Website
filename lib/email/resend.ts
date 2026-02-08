import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export function getResendClient(): Resend | null {
  if (!apiKey) return null;
  return new Resend(apiKey);
}

/** From address for transactional emails. Use a verified domain in production. */
export function getFromEmail(): string | undefined {
  return process.env.RESEND_FROM_EMAIL;
}
