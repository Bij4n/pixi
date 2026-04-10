import { test, expect } from "@playwright/test";
import path from "path";
import { writeFileSync, mkdirSync } from "fs";

const FIXTURE = path.join(__dirname, ".fixtures", "tiny.png");

test.beforeAll(() => {
  mkdirSync(path.dirname(FIXTURE), { recursive: true });
  // 1x1 red PNG
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/AAAZ4gk3AAAAAXRSTlPM0jRW/QAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=",
    "base64",
  );
  writeFileSync(FIXTURE, png);
});

test("end-to-end: signup, upload, see view logged", async ({
  page,
  context,
}) => {
  const email = `e2e-${Date.now()}@example.com`;
  const password = "testpassword123";

  // Sign up
  await page.goto("/signup");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /create account/i }).click();

  // Land on dashboard empty state
  await expect(
    page.getByRole("heading", {
      name: /upload your first image to start tracking/i,
    }),
  ).toBeVisible();

  // Upload
  await page.getByRole("link", { name: /upload an image/i }).click();
  await page.setInputFiles('input[type="file"]', FIXTURE);

  // Land on image detail page
  await expect(page.getByText(/total views/i)).toBeVisible();
  await expect(page.getByText(/c2pa signed/i)).toBeVisible();

  // Grab the tracked URL from the page
  const trackedUrl = await page
    .locator("text=/http:\\/\\/localhost:3100\\/t\\//")
    .first()
    .textContent();
  expect(trackedUrl).toBeTruthy();
  const slug = trackedUrl!.split("/t/")[1].trim();

  // Hit the tracking URL in a fresh context (no cookies)
  const anon = await context.browser()!.newContext();
  const anonPage = await anon.newPage();
  await anonPage.goto(`http://localhost:3100/t/${slug}`);
  await anon.close();

  // Reload detail page, expect the "Total views" card to show a non-zero count
  // and a row to appear in "Recent views"
  await page.reload();
  await expect(
    page.locator("text=Total views").locator("..").locator("text=1"),
  ).toBeVisible();
  await expect(page.getByText(/recent views/i)).toBeVisible();
  await expect(page.getByText("Mozilla/5.0").first()).toBeVisible();
});
