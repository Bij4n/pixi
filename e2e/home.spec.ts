import { test, expect } from "@playwright/test";

test("landing page shows the single visual moment", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /know where your images end up/i }),
  ).toBeVisible();
  await expect(page.getByText(/12 people viewed this/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /try it free/i })).toBeVisible();
});

test("how it works section exists below the fold", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /how it works/i }),
  ).toBeVisible();
});
