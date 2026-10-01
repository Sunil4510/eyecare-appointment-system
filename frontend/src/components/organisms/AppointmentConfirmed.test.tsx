import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppointmentConfirmed } from "./AppointmentConfirmed";

describe("AppointmentConfirmed Component", () => {
  const mockBooking = {
    service: "Consult",
    clinic: "Downtown Eye Clinic",
    optician: "Alice Smith",
    date: "21 January 2026",
    time: "11:00 AM",
    notes: "Eye strain",
    emailConfirmation: "james@gmail.com",
  };

  it("renders booking confirmation details and Back to Home button", () => {
    const handleBack = vi.fn();
    render(
      <AppointmentConfirmed
        bookingDetails={mockBooking}
        onClickCallback={handleBack}
      />
    );

    expect(screen.getByText("Appointment Booked Successfully!")).toBeInTheDocument();
    expect(screen.getByText("Consult")).toBeInTheDocument();
    expect(screen.getByText("Downtown Eye Clinic")).toBeInTheDocument();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("21 January 2026")).toBeInTheDocument();
    expect(screen.getByText("11:00 AM")).toBeInTheDocument();
    expect(screen.getByText("Eye strain")).toBeInTheDocument();
    expect(screen.getByText("james@gmail.com")).toBeInTheDocument();

    const backBtn = screen.getByRole("button", { name: "Back to Home" });
    fireEvent.click(backBtn);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });
});
