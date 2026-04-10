import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/password";

const signupSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Email must be valid and password at least 8 characters" },
      { status: 400 },
    );
  }

  const email = parsed.data.email.toLowerCase();

  const existing = db.select().from(users).where(eq(users.email, email)).get();
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists" },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const id = nanoid();
  db.insert(users).values({ id, email, passwordHash }).run();

  return NextResponse.json({ id, email }, { status: 201 });
}
