import { expect, test, beforeEach } from "vitest";
import { signImageBuffer, verifyImageBuffer, stripSignature } from "@/lib/c2pa";

beforeEach(() => {
  process.env.AUTH_SECRET = "test-secret-for-vitest";
});

test("signs a buffer and produces verifiable output", async () => {
  const original = Buffer.from("fake-image-bytes-pretending-to-be-a-png");
  const { buffer, signed } = await signImageBuffer(original, "image/png");

  expect(signed).toBe(true);
  expect(buffer.length).toBeGreaterThan(original.length);

  const verification = await verifyImageBuffer(buffer);
  expect(verification.signed).toBe(true);
  expect(verification.manifest?.issuer).toBe("pixi.local");
  expect(verification.manifest?.contentHash).toMatch(/^[a-f0-9]{64}$/);
});

test("unsigned buffer returns signed: false", async () => {
  const result = await verifyImageBuffer(Buffer.from("no-signature-here"));
  expect(result.signed).toBe(false);
});

test("tampered content invalidates signature", async () => {
  const original = Buffer.from("original-image-data");
  const { buffer } = await signImageBuffer(original, "image/png");

  // Flip a byte in the original content
  const tampered = Buffer.from(buffer);
  tampered[0] = tampered[0] ^ 0xff;

  const verification = await verifyImageBuffer(tampered);
  expect(verification.signed).toBe(false);
});

test("stripSignature recovers original bytes", async () => {
  const original = Buffer.from("the-real-image-content");
  const { buffer } = await signImageBuffer(original, "image/jpeg");
  const stripped = stripSignature(buffer);
  expect(stripped.equals(original)).toBe(true);
});
