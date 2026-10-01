/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "./Home";
import * as services from "../../services";

describe("Home", () => {
  beforeEach(() => {
    vi.spyOn(services, "fetchAppointmentsAPI").mockResolvedValue([]);
  });

  it("renders the page with upcoming appointments heading", async () => {
    render(<Home />);

    expect(screen.getByText("Upcoming Appointments")).toBeInTheDocument();

    // Wait for async state updates to complete
    await waitFor(() => {
      expect(services.fetchAppointmentsAPI).toHaveBeenCalled();
    });
  });

  it("renders the AppointmentTable component", async () => {
    const { container } = render(<Home />);

    const table = container.querySelector(".ant-table");
    expect(table).toBeInTheDocument();

    // Wait for async state updates to complete
    await waitFor(() => {
      expect(services.fetchAppointmentsAPI).toHaveBeenCalled();
    });
  });
});
