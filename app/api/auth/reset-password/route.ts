import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resetPasswordSchema } from "@/lib/zod";
import { hashToken } from "@/lib/tokens";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { token, password } = await resetPasswordSchema.parseAsync(body);
    const hashed = hashToken(token);

    const database = await db();
    const passwordResetTokens = database.collection("passwordResetTokens");
    const tokenDoc = await passwordResetTokens.findOne({ token: hashed });

    if (!tokenDoc || !tokenDoc.userId) {
      return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
    }

    if (tokenDoc.expiresAt && new Date(tokenDoc.expiresAt) < new Date()) {
      await passwordResetTokens.deleteOne({ _id: tokenDoc._id });
      return NextResponse.json({ error: "Reset link has expired" }, { status: 400 });
    }

    const users = database.collection("users");
    const userId = tokenDoc.userId;
    const userObjectId = typeof userId === "string" ? new ObjectId(userId) : userId;
    const user = await users.findOne({ _id: userObjectId }, { projection: { password: 1 } });

    if (!user) {
      await passwordResetTokens.deleteMany({ userId: tokenDoc.userId });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const samePassword = user.password ? await bcrypt.compare(password, user.password) : false;
    if (samePassword) {
      return NextResponse.json({ error: "New password must be different" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await users.updateOne(
      { _id: userObjectId },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    );

    await passwordResetTokens.deleteMany({ userId: tokenDoc.userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error resetting password:", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
