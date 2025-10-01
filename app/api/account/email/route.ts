import { auth } from "@/auth";
import { db } from "@/lib/db";
import { updateEmailSchema } from "@/lib/zod";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { newEmail, currentPassword } = await updateEmailSchema.parseAsync(body);
    const normalizedEmail = newEmail.trim().toLowerCase();

    const database = await db();
    const users = database.collection("users");
    const accounts = database.collection("accounts");
    const userId = new ObjectId(session.user.id);

    const [user, googleAccount] = await Promise.all([
      users.findOne({ _id: userId }, { projection: { email: 1, password: 1, emailVerified: 1 } }),
      accounts.findOne({ userId, provider: "google" }, { projection: { _id: 1 } }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.password) {
      return NextResponse.json({ error: "Password login not configured for this account" }, { status: 400 });
    }

    if (googleAccount) {
      return NextResponse.json({ error: "Email is managed through Google sign-in" }, { status: 400 });
    }

    if (user.email === normalizedEmail) {
      return NextResponse.json({ error: "New email matches the current email" }, { status: 400 });
    }

    const existing = await users.findOne({ email: normalizedEmail }, { projection: { _id: 1 } });
    if (existing) {
      return NextResponse.json({ error: "Another account already uses this email" }, { status: 400 });
    }

    const matches = await bcrypt.compare(currentPassword, user.password);
    if (!matches) {
      return NextResponse.json({ error: "Password is incorrect" }, { status: 400 });
    }

    const { token, hashedToken, expiresAt } = generateVerificationToken();
    const verificationTokens = database.collection("emailVerificationTokens");

    await verificationTokens.deleteMany({ userId: session.user.id });

    await users.updateOne(
      { _id: userId },
      {
        $set: {
          email: normalizedEmail,
          emailVerified: null,
          updatedAt: new Date(),
        },
      }
    );

    await verificationTokens.insertOne({
      userId: session.user.id,
      token: hashedToken,
      expiresAt,
      createdAt: new Date(),
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

    await sendVerificationEmail({ to: normalizedEmail, url: verificationUrl });

    return NextResponse.json({ success: true, email: normalizedEmail });
  } catch (error) {
    console.error("Error updating email:", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid email" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
