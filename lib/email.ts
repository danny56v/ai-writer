import nodemailer from "nodemailer";

type VerificationEmailPayload = {
  to: string;
  url: string;
};

type PasswordResetEmailPayload = {
  to: string;
  url: string;
};

let transporterPromise:
  | ReturnType<typeof nodemailer.createTransport>
  | null = null;

function getTransporter() {
  if (!transporterPromise) {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !port || !user || !pass) {
      return null;
    }

    transporterPromise = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return transporterPromise;
}

export async function sendVerificationEmail({ to, url }: VerificationEmailPayload) {
  const from = process.env.EMAIL_FROM ?? "no-reply@scriptsnest.ai";
  const transporter = getTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <h2 style="color:#4f46e5;">Confirm your email address</h2>
      <p>Welcome to HomeListerAi! Click the button below to activate your account.</p>
      <p style="margin: 24px 0;">
        <a href="${url}" style="display:inline-block;padding:12px 20px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px;">Activate account</a>
      </p>
      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p style="word-break:break-all;"><a href="${url}">${url}</a></p>
      <p style="margin-top:32px;color:#6b7280;font-size:12px;">This link is valid for 24 hours.</p>
    </div>
  `;

  if (!transporter) {
    console.warn("SMTP configuration missing. Verification email not sent.");
    console.info(`Verification link for ${to}: ${url}`);
    return;
  }

  await transporter.sendMail({
    to,
    from,
    subject: "Confirm your email for HomeListerAi",
    html,
  });
}

export async function sendPasswordResetEmail({ to, url }: PasswordResetEmailPayload) {
  const from = process.env.EMAIL_FROM ?? "no-reply@scriptsnest.ai";
  const transporter = getTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <h2 style="color:#4f46e5;">Reset your HomeListerAi password</h2>
      <p>We received a request to reset your password. Click the button below to choose a new one.</p>
      <p style="margin: 24px 0;">
        <a href="${url}" style="display:inline-block;padding:12px 20px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px;">Reset password</a>
      </p>
      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p style="word-break:break-all;"><a href="${url}">${url}</a></p>
      <p style="margin-top:32px;color:#6b7280;font-size:12px;">This link expires in 1 hour. If you didn’t request a reset, you can safely ignore this email.</p>
    </div>
  `;

  if (!transporter) {
    console.warn("SMTP configuration missing. Password reset email not sent.");
    console.info(`Password reset link for ${to}: ${url}`);
    return;
  }

  await transporter.sendMail({
    to,
    from,
    subject: "Reset your HomeListerAi password",
    html,
  });
}
