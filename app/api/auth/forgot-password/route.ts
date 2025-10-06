import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/zod";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { email } = await forgotPasswordSchema.parseAsync(body);
    const normalizedEmail = email.trim().toLowerCase();

    const database = await db();
    const users = database.collection("users");
    const user = await users.findOne(
      { email: normalizedEmail },
      { projection: { _id: 1, password: 1, emailVerified: 1 } }
    );

    if (!user || !user.password) {
      return NextResponse.json({ success: true });
    }

    const passwordResetTokens = database.collection("passwordResetTokens");
    await passwordResetTokens.deleteMany({ userId: user._id.toString() });
    const { token, hashedToken, expiresAt } = generatePasswordResetToken();

    await passwordResetTokens.insertOne({
      userId: user._id.toString(),
      token: hashedToken,
      expiresAt,
      createdAt: new Date(),
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://listologyai.com";
    const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;

    await sendPasswordResetEmail({ to: normalizedEmail, url: resetUrl });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating password reset request:", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid email" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
