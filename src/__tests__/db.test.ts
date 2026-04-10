import { expect, test, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { nanoid } from "nanoid";

let sqlite: Database.Database;
let db: ReturnType<typeof drizzle<typeof schema>>;

beforeEach(() => {
  sqlite = new Database(":memory:");
  sqlite.exec(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE TABLE images (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      slug TEXT NOT NULL UNIQUE,
      filename TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      storage_path TEXT NOT NULL,
      c2pa_signed INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE TABLE events (
      id TEXT PRIMARY KEY,
      image_id TEXT NOT NULL REFERENCES images(id) ON DELETE CASCADE,
      ip TEXT,
      user_agent TEXT,
      referer TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `);
  db = drizzle(sqlite, { schema });
});

afterEach(() => {
  sqlite.close();
});

test("can insert and query a user", () => {
  const id = nanoid();
  db.insert(schema.users)
    .values({ id, email: "a@b.com", passwordHash: "hashed" })
    .run();

  const found = db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, "a@b.com"))
    .get();

  expect(found).toBeDefined();
  expect(found?.id).toBe(id);
});

test("cascade deletes images when user deleted", () => {
  const userId = nanoid();
  db.insert(schema.users)
    .values({ id: userId, email: "x@y.com", passwordHash: "h" })
    .run();
  db.insert(schema.images)
    .values({
      id: nanoid(),
      userId,
      slug: "abc",
      filename: "test.png",
      mimeType: "image/png",
      sizeBytes: 100,
      storagePath: "/tmp/x",
    })
    .run();

  db.delete(schema.users).where(eq(schema.users.id, userId)).run();

  const images = db.select().from(schema.images).all();
  expect(images.length).toBe(0);
});
