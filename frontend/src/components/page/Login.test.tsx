import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./Login";

vi.mock("../../services", () => ({
  loginAPI: vi.fn().mockResolvedValue({
    message: "Login successful",
    user: {
      id: "550e8400-e29b-41d4-a716-446655440000",
      email: "james@gmail.com",
      role: "patient",
      first_name: "James",
      last_name: "Smith",
    },
  }),
}));

describe("Login Component", () => {
  it("renders login form with title, email, and password inputs", () => {
    render(<Login />);

    expect(screen.getByText("Eye Care App")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("renders demo credential buttons and fills inputs when clicked", () => {
    render(<Login />);

    const patientBtn = screen.getByRole("button", { name: /Patient: James/i });
    const opticianBtn = screen.getByRole("button", { name: /Optician: Mary/i });

    expect(patientBtn).toBeInTheDocument();
    expect(opticianBtn).toBeInTheDocument();

    fireEvent.click(patientBtn);

    const emailInput = screen.getByPlaceholderText("Enter your email") as HTMLInputElement;
    expect(emailInput.value).toBe("james@gmail.com");
  });
});
