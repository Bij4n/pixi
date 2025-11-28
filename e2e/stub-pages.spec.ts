import { test, expect } from "@playwright/test";

const stubs = [
  { path: "/login", heading: /sign in/i },
  { path: "/signup", heading: /create account/i },
  { path: "/privacy", heading: /privacy policy/i },
  { path: "/terms", heading: /terms of service/i },
];

for (const { path, heading } of stubs) {
  test(`${path} renders heading and back link`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /back to home/i }),
    ).toBeVisible();
  });
}
