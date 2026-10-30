import nodemailer from "nodemailer";
import { getMailEnv } from "@/lib/server/env";

type SendMailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendMail(input: SendMailInput): Promise<void> {
  const env = getMailEnv();

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
}

export function buildVerificationEmail(params: {
  name: string | null;
  verifyUrl: string;
}): { subject: string; html: string; text: string } {
  const greeting = params.name ? `Merhaba ${params.name},` : "Merhaba,";
  const subject = "Pylmor hesabını doğrula";
  const text = [
    greeting,
    "",
    "Pylmor hesabını etkinleştirmek için aşağıdaki bağlantıya tıkla. Hesabın açılacak ve otomatik giriş yapılacak:",
    params.verifyUrl,
    "",
    "Bu bağlantı 24 saat geçerlidir. Sen kayıt olmadıysan bu e-postayı yok sayabilirsin.",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="tr">
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;padding:32px;">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f766e;">Pylmor</p>
                <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;">Hesabını doğrula</h1>
                <p style="margin:0 0 12px;font-size:15px;line-height:1.5;">${greeting}</p>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.5;">
                  Kayıt işlemini tamamlamak için aşağıdaki butona tıkla. Hesabın etkinleşecek ve otomatik olarak giriş yapacaksın.
                </p>
                <p style="margin:0 0 24px;text-align:center;">
                  <a href="${params.verifyUrl}" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 24px;border-radius:10px;">
                    Hesabı etkinleştir
                  </a>
                </p>
                <p style="margin:0;font-size:13px;line-height:1.5;color:#71717a;">
                  Buton çalışmazsa bu bağlantıyı tarayıcına yapıştır:<br />
                  <a href="${params.verifyUrl}" style="color:#0f766e;word-break:break-all;">${params.verifyUrl}</a>
                </p>
                <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#a1a1aa;">
                  Bu bağlantı 24 saat geçerlidir. Sen kayıt olmadıysan bu e-postayı yok sayabilirsin.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
}
