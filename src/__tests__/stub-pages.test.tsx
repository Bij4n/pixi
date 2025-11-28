import { expect, test, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import SignupPage from "@/app/signup/page";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";

afterEach(cleanup);

test("login page renders sign in heading and back link", () => {
  render(<LoginPage />);
  expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute(
    "href",
    "/",
  );
});

test("signup page renders create account heading and back link", () => {
  render(<SignupPage />);
  expect(
    screen.getByRole("heading", { name: /create account/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute(
    "href",
    "/",
  );
});

test("privacy page renders privacy policy heading and back link", () => {
  render(<PrivacyPage />);
  expect(
    screen.getByRole("heading", { name: /privacy policy/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute(
    "href",
    "/",
  );
});

test("terms page renders terms of service heading and back link", () => {
  render(<TermsPage />);
  expect(
    screen.getByRole("heading", { name: /terms of service/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute(
    "href",
    "/",
  );
});
