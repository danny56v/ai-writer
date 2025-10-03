"use server";

import { signIn, signOut } from "@/auth";
import { getDb } from "@/lib/db"; // <— important
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { ActionState } from "@/interfaces/auth";
import { signInSchema, signUpSchema } from "../zod";
import { ZodError } from "zod";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

function resolveCallbackUrl(target: FormDataEntryValue | null | undefined) {
  if (typeof target !== "string") {
    return "/";
  }
  if (!target.startsWith("/")) {
    return "/";
  }
  if (target.startsWith("//")) {
    return "/";
  }
  return target;
}

function appendCallbackParam(url: string, callbackUrl: string) {
  if (!callbackUrl) {
    return url;
  }
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

export const signInGoogle = async (formData: FormData) => {
  const callbackUrl = resolveCallbackUrl(formData.get("callbackUrl"));
  await signIn("google", { redirectTo: callbackUrl });
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/sign-in" });
};

function mapZodFieldErrors(error: ZodError): NonNullable<ActionState["errors"]> {
  const fieldErrors = error.formErrors.fieldErrors;
  const mapped: NonNullable<ActionState["errors"]> = {};
  if (fieldErrors.email?.length) {
    mapped.email = fieldErrors.email;
  }
  if (fieldErrors.password?.length) {
    mapped.password = fieldErrors.password;
  }
  if (fieldErrors.name?.length) {
    mapped.name = fieldErrors.name;
  }
  return mapped;
}

export const SignInAction = async (_prev: ActionState, formData: FormData): Promise<ActionState> => {
  const callbackUrl = resolveCallbackUrl(formData.get("callbackUrl"));
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const validated = signInSchema.parse(data);
    const normalizedEmail = validated.email.trim().toLowerCase();

    const db = await getDb();
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email: normalizedEmail });
    if (!user || !user.password) {
      return {
        success: false,
        message: "",
        errors: { password: ["Incorrect email or password"] },
        email: normalizedEmail,
      };
    }

    const passwordMatches = await bcrypt.compare(validated.password, user.password);
    if (!passwordMatches) {
      return {
        success: false,
        message: "",
        errors: { password: ["Incorrect email or password"] },
        email: normalizedEmail,
      };
    }

    if (!user.emailVerified) {
      return {
        success: false,
        message: "You need to confirm your email before signing in.",
        allowResend: true,
        email: normalizedEmail,
      };
    }

    const result = await signIn("credentials", {
      email: normalizedEmail,
      password: validated.password,
      redirect: false, // <— corect
    });

    if (result?.error) {
      return {
        success: false,
        message: "",
        errors: { password: ["Incorrect email or password"] },
        email: normalizedEmail,
      };
    }

    redirect(callbackUrl);
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        const emailValue = typeof data.email === "string" ? data.email : undefined;
        return {
          success: false,
          message: "",
          errors: { password: ["Incorrect email or password"] },
          email: emailValue,
        };
      }
      return {
        success: false,
        message: "Authentication error",
      };
    }
    if (error instanceof ZodError) {
      const emailValue = typeof data.email === "string" ? data.email : undefined;
      return {
        success: false,
        message: "",
        errors: mapZodFieldErrors(error),
        email: emailValue,
      };
    }
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;

    return { success: false, message: "Something went wrong. Please try again." };
  }
};

export const SignUpAction = async (_prev: ActionState, formData: FormData): Promise<ActionState> => {
  const callbackUrl = resolveCallbackUrl(formData.get("callbackUrl"));
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const validated = signUpSchema.parse(data);

    const db = await getDb();
    const users = db.collection("users");

    // Normalize email
    const email = validated.email.trim().toLowerCase();

    // Ensure uniqueness
    const existing = await users.findOne({ email });
    if (existing) {
      if (existing.emailVerified) {
        return {
          success: false,
          message: "",
          errors: { email: ["An active account already exists for this email"] },
          email,
        };
      }

      const { token, hashedToken, expiresAt } = generateVerificationToken();
      const verificationTokens = db.collection("emailVerificationTokens");

      await verificationTokens.deleteMany({ userId: existing._id.toString() });
      await verificationTokens.insertOne({
        userId: existing._id.toString(),
        token: hashedToken,
        expiresAt,
        createdAt: new Date(),
      });

      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
      const verificationUrl = appendCallbackParam(
        `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`,
        callbackUrl
      );
      await sendVerificationEmail({ to: email, url: verificationUrl });

      redirect(appendCallbackParam(`/check-email?email=${encodeURIComponent(email)}&resent=1`, callbackUrl));
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12);

    const insertResult = await users.insertOne({
      name: email.split("@")[0],
      email,
      password: hashedPassword,
      emailVerified: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const userId = insertResult.insertedId.toString();
    const { token, hashedToken, expiresAt } = generateVerificationToken();

    const verificationTokens = db.collection("emailVerificationTokens");
    await verificationTokens.insertOne({
      userId,
      token: hashedToken,
      expiresAt,
      createdAt: new Date(),
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const verificationUrl = appendCallbackParam(
      `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`,
      callbackUrl
    );
    await sendVerificationEmail({ to: email, url: verificationUrl });

    redirect(appendCallbackParam(`/check-email?email=${encodeURIComponent(email)}`, callbackUrl));
  } catch (error) {
    if (typeof error === "object" && error && "digest" in error && String(error.digest).startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    if (error instanceof ZodError) {
      const emailValue = typeof data.email === "string" ? (data.email as string) : undefined;
      return {
        success: false,
        message: "",
        errors: mapZodFieldErrors(error),
        email: emailValue,
      };
    }
    console.error("Sign up error:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
};
