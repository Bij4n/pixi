import { expect, test, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Home from "@/app/page";

afterEach(cleanup);

test("renders headline", () => {
  render(<Home />);
  expect(
    screen.getByRole("heading", { name: /know where your images end up/i }),
  ).toBeInTheDocument();
});

test("renders the tracking indicator on the image card", () => {
  render(<Home />);
  expect(screen.getByText(/12 people viewed this/i)).toBeInTheDocument();
});

test("renders try-it-free CTA", () => {
  render(<Home />);
  expect(
    screen.getByRole("link", { name: /try it free/i }),
  ).toBeInTheDocument();
});

test("renders how-it-works section", () => {
  render(<Home />);
  expect(
    screen.getByRole("heading", { name: /how it works/i }),
  ).toBeInTheDocument();
});
