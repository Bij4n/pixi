import { test, expect } from "@playwright/test";

test("user can change their password", async ({ page }) => {
  const email = `pw-${Date.now()}@example.com`;
  const originalPassword = "originalPw123";
  const newPassword = "newPw4567";

  // Sign up
  await page.goto("/signup");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(originalPassword);
  await page.getByRole("button", { name: /create account/i }).click();
  await expect(
    page.getByRole("heading", {
      name: /upload your first image to start tracking/i,
    }),
  ).toBeVisible();

  // Navigate to settings and change password
  await page.goto("/dashboard/settings");
  await page.getByLabel(/current password/i).fill(originalPassword);
  await page.getByLabel(/new password/i).fill(newPassword);
  await page.getByRole("button", { name: /update password/i }).click();
  await expect(page.getByText(/password updated/i)).toBeVisible();

  // Sign out, then try old password (should fail) then new (should succeed)
  await page.getByRole("button", { name: /sign out/i }).click();
  await expect(
    page.getByRole("heading", { name: /know where your images end up/i }),
  ).toBeVisible();

  await page.goto("/login");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(originalPassword);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page.getByText(/invalid email or password/i)).toBeVisible();

  await page.getByLabel(/password/i).fill(newPassword);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(
    page.getByRole("heading", {
      name: /upload your first image to start tracking/i,
    }),
  ).toBeVisible();
});
