import { promises as fs } from "fs";
import path from "path";

const STORAGE_DIR = process.env.STORAGE_DIR ?? "./storage/images";

export async function saveImage(
  buffer: Buffer,
  id: string,
  extension: string,
): Promise<string> {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
  const safeExt = extension.replace(/[^a-z0-9]/gi, "").toLowerCase() || "bin";
  const filepath = path.join(STORAGE_DIR, `${id}.${safeExt}`);
  await fs.writeFile(filepath, buffer);
  return filepath;
}

export async function readImage(storagePath: string): Promise<Buffer> {
  return fs.readFile(storagePath);
}

export async function deleteImage(storagePath: string): Promise<void> {
  try {
    await fs.unlink(storagePath);
  } catch {
    // ignore — file already gone
  }
}
