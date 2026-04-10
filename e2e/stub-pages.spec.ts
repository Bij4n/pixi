import { test, expect } from "@playwright/test";

test("/login renders sign in form", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});

test("/signup renders create account form", async ({ page }) => {
  await page.goto("/signup");
  await expect(
    page.getByRole("heading", { name: /create account/i }),
  ).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
});

test("/privacy renders heading and back link", async ({ page }) => {
  await page.goto("/privacy");
  await expect(
    page.getByRole("heading", { name: /privacy policy/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /back to home/i })).toBeVisible();
});

test("/terms renders heading and back link", async ({ page }) => {
  await page.goto("/terms");
  await expect(
    page.getByRole("heading", { name: /terms of service/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /back to home/i })).toBeVisible();
});
