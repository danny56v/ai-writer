import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import { z } from "zod";

const resendSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { email } = await resendSchema.parseAsync(body);
    const normalizedEmail = email.trim().toLowerCase();

    const database = await db();
    const users = database.collection("users");
    const user = await users.findOne({ email: normalizedEmail }, { projection: { _id: 1, emailVerified: 1 } });

    if (!user) {
      // Avoid leaking registered emails
      return NextResponse.json({ success: true });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 });
    }

    const verificationTokens = database.collection("emailVerificationTokens");
    await verificationTokens.deleteMany({ userId: user._id.toString() });

    const { token, hashedToken, expiresAt } = generateVerificationToken();
    await verificationTokens.insertOne({
      userId: user._id.toString(),
      token: hashedToken,
      expiresAt,
      createdAt: new Date(),
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

    await sendVerificationEmail({ to: normalizedEmail, url: verificationUrl });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error resending verification email:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid email" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
