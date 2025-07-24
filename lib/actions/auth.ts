"use server";

import { signIn, signOut } from "@/auth";
import client from "../db";
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

export const SignInAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  try {
    const validatedData = signInSchema.parse(data);

    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false 
    });

    if (result?.error) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    redirect("/");
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.type === "CredentialsSignin" ? "Invalid Credentials" : "Error",
      };
    }

    if (error instanceof ZodError) {
      return {
        success: false,
        message: error.issues[0]?.message || "Invalid input",
      };
    }
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // Re-throw redirect errors
    }

    return {
      success: false,
      message: "Something went wrong. Please try again. fgfggf",
    };
  }
};

export const SignUpAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const validatedData = signUpSchema.parse(data);

    const users = await client.db().collection("users");
    const existingUser = await users.findOne({ email: validatedData.email });
    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    await users.insertOne({
      name: validatedData.email.split("@")[0],
      email: validatedData.email,
      password: hashedPassword,
    });
    redirect("/sign-in");
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};

      (error as ZodError).issues.forEach((err) => {
        const field = String(err.path[0]);
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field]?.push(err.message);
      });

      const firstErrorMessage = error.issues[0]?.message || "Invalid input";

      return {
        success: false,
        message: firstErrorMessage,
      };
    }

    // Gestionează alte erori
    console.error("Sign up error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};
