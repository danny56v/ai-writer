"use server";

import { signIn, signOut } from "@/auth";
import { getDb } from "@/lib/db"; // <— important
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { ActionState } from "@/interfaces/auth";
import { signInSchema, signUpSchema } from "../zod";
import { ZodError } from "zod";
import { AuthError } from "next-auth";

export const signInGoogle = async () => {
  await signIn("google", { redirectTo: "/" });
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/sign-in" });
};

export const SignInAction = async (_prev: ActionState, formData: FormData): Promise<ActionState> => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const validated = signInSchema.parse(data);

    const result = await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false, // <— corect
    });

    if (result?.error) {
      return { success: false, message: "Email sau parolă greșită" };
    }

    redirect("/");
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.type === "CredentialsSignin" ? "Email sau parolă greșită" : "Eroare de autentificare",
      };
    }
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0]?.message || "Date invalide" };
    }
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;

    return { success: false, message: "A apărut o eroare. Încearcă din nou." };
  }
};

export const SignUpAction = async (_prev: ActionState, formData: FormData): Promise<ActionState> => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const validated = signUpSchema.parse(data);

    const db = await getDb();
    const users = db.collection("users");

    // Normalizează emailul
    const email = validated.email.trim().toLowerCase();

    // Unicitate
    const existing = await users.findOne({ email });
    if (existing) {
      return { success: false, message: "Există deja un cont cu acest email" };
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12);

    await users.insertOne({
      name: email.split("@")[0],
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    redirect("/sign-in");
  } catch (error) {
    if (typeof error === "object" && error && "digest" in error && String(error.digest).startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0]?.message || "Date invalide" };
    }
    console.error("Sign up error:", error);
    return { success: false, message: "A apărut o eroare. Încearcă din nou." };
  }
};
