import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashToken } from "@/lib/tokens";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const db = await getDb();
  const verificationTokens = db.collection("emailVerificationTokens");

  const hashedToken = hashToken(token);
  const tokenDoc = await verificationTokens.findOne({ token: hashedToken });

  if (!tokenDoc) {
    return NextResponse.redirect(new URL("/sign-in?verified=0", url));
  }

  if (tokenDoc.expiresAt && new Date(tokenDoc.expiresAt) < new Date()) {
    await verificationTokens.deleteOne({ _id: tokenDoc._id });
    return NextResponse.redirect(new URL("/sign-in?verified=expired", url));
  }

  const users = db.collection("users");
  const userId = tokenDoc.userId;

  await users.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { emailVerified: new Date(), updatedAt: new Date() } }
  );

  await verificationTokens.deleteMany({ userId });

  const redirectUrl = new URL("/sign-in?verified=1", url);
  return NextResponse.redirect(redirectUrl);
}

