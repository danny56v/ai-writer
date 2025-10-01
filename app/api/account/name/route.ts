import { auth } from "@/auth";
import { db } from "@/lib/db";
import { updateNameSchema } from "@/lib/zod";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
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

    const { name } = await updateNameSchema.parseAsync(body);

    const database = await db();
    const users = database.collection("users");

    const userId = new ObjectId(session.user.id);
    const existing = await users.findOne({ _id: userId }, { projection: { name: 1 } });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (existing.name === name) {
      return NextResponse.json({ error: "Please enter a different name" }, { status: 400 });
    }

    await users.updateOne(
      { _id: userId },
      {
        $set: {
          name,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true, name });
  } catch (error) {
    console.error("Error updating name:", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid name" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
