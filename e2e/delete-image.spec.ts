import { test, expect } from "@playwright/test";
import path from "path";

const FIXTURE = path.join(__dirname, ".fixtures", "tiny.png");

test("user can delete an image from the detail page", async ({ page }) => {
  const email = `delete-${Date.now()}@example.com`;
  const password = "testpassword123";

  await page.goto("/signup");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /create account/i }).click();

  await expect(
    page.getByRole("heading", {
      name: /upload your first image to start tracking/i,
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: /upload an image/i }).click();
  await page.setInputFiles('input[type="file"]', FIXTURE);

  await expect(page.getByText(/total views/i)).toBeVisible();

  // Accept the confirm dialog
  page.on("dialog", (d) => d.accept());

  await page.getByRole("button", { name: /delete image/i }).click();

  // Back on empty dashboard
  await expect(
    page.getByRole("heading", {
      name: /upload your first image to start tracking/i,
    }),
  ).toBeVisible();
});
