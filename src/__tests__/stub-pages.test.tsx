import { expect, test, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";

afterEach(cleanup);

// next/navigation is needed by auth form pages; stub it here even though these
// tests don't use it, to keep the module graph clean.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

test("privacy page renders heading and back link", () => {
  render(<PrivacyPage />);
  expect(
    screen.getByRole("heading", { name: /privacy policy/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute(
    "href",
    "/",
  );
});

test("terms page renders heading and back link", () => {
  render(<TermsPage />);
  expect(
    screen.getByRole("heading", { name: /terms of service/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute(
    "href",
    "/",
  );
});
