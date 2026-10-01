import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Catalogue from "./Catalogue";

vi.mock("../../services", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    fetchCatalogueTableAPI: vi.fn().mockResolvedValue([
      {
        service: { id: "s1", name: "Consult", description: "Eye consult" },
        clinic: {
          id: "c1",
          name: "Downtown Eye Clinic",
          opticians: [{ id: "o1", name: "Alice Smith" }],
        },
      },
      {
        service: { id: "s2", name: "Therapy", description: "Vision therapy" },
        clinic: {
          id: "c2",
          name: "Uptown Vision Center",
          opticians: [{ id: "o2", name: "Bob Johnson" }],
        },
      },
    ]),
  };
});

describe("Catalogue Component", () => {
  it("renders search input, filter dropdowns, and service table", async () => {
    render(<Catalogue />);

    expect(screen.getByPlaceholderText("Search keywords...")).toBeInTheDocument();

    const downtownClinic = await screen.findByText("Downtown Eye Clinic", {}, { timeout: 3000 });
    expect(downtownClinic).toBeInTheDocument();
    expect(screen.getByText("Uptown Vision Center")).toBeInTheDocument();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();

    const checkButtons = screen.getAllByRole("button", { name: "Check Availability" });
    expect(checkButtons.length).toBe(2);
  });
});
