import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashToken } from "@/lib/tokens";
import { ObjectId } from "mongodb";

function resolveCallbackUrl(value: string | null) {
  if (!value) {
    return null;
  }
  if (!value.startsWith("/")) {
    return null;
  }
  if (value.startsWith("//")) {
    return null;
  }
  return value;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const callbackUrl = resolveCallbackUrl(url.searchParams.get("callbackUrl"));

  const buildRedirectUrl = (pathname: string) => {
    const redirectUrl = new URL(pathname, url);
    if (callbackUrl) {
      redirectUrl.searchParams.set("callbackUrl", callbackUrl);
    }
    return redirectUrl;
  };

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const db = await getDb();
  const verificationTokens = db.collection("emailVerificationTokens");

  const hashedToken = hashToken(token);
  const tokenDoc = await verificationTokens.findOne({ token: hashedToken });

  if (!tokenDoc) {
    return NextResponse.redirect(buildRedirectUrl("/sign-in?verified=0"));
  }

  if (tokenDoc.expiresAt && new Date(tokenDoc.expiresAt) < new Date()) {
    await verificationTokens.deleteOne({ _id: tokenDoc._id });
    return NextResponse.redirect(buildRedirectUrl("/sign-in?verified=expired"));
  }

  const users = db.collection("users");
  const userId = tokenDoc.userId;

  await users.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { emailVerified: new Date(), updatedAt: new Date() } }
  );

  await verificationTokens.deleteMany({ userId });

  return NextResponse.redirect(buildRedirectUrl("/sign-in?verified=1"));
}
