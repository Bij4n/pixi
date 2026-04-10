import { expect, test, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Home from "@/app/page";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

afterEach(cleanup);

test("renders headline", async () => {
  const ui = await Home();
  render(ui);
  expect(
    screen.getByRole("heading", { name: /know where your images end up/i }),
  ).toBeInTheDocument();
});

test("renders the tracking indicator on the image card", async () => {
  const ui = await Home();
  render(ui);
  expect(screen.getByText(/12 people viewed this/i)).toBeInTheDocument();
});

test("renders try-it-free CTA when signed out", async () => {
  const ui = await Home();
  render(ui);
  expect(
    screen.getByRole("link", { name: /try it free/i }),
  ).toBeInTheDocument();
});

test("renders how-it-works section", async () => {
  const ui = await Home();
  render(ui);
  expect(
    screen.getByRole("heading", { name: /how it works/i }),
  ).toBeInTheDocument();
});
