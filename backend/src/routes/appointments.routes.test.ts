import appointmentsRouter, { getDateString, getSlotFromDateTime } from "./appointments.routes";

function getHandler(method: string, path: string) {
  const layer = (appointmentsRouter as any).stack.find(
    (l: any) => l.route && l.route.path === path && l.route.methods[method.toLowerCase()]
  );
  if (!layer) throw new Error(`Route handler not found for ${method} ${path}`);
  return layer.route.stack[0].handle;
}

function createMockRes() {
  return {
    statusCode: 200,
    body: undefined as any,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: any) {
      this.body = payload;
      return this;
    },
  };
}

describe("appointments.routes", () => {
  describe("Helper functions", () => {
    it("getDateString parses ISO and date strings correctly", () => {
      expect(getDateString("2026-01-21T09:00:00Z")).toBe("2026-01-21");
      expect(getDateString("2025-10-02T11:30:00Z")).toBe("2025-10-02");
    });

    it("getSlotFromDateTime extracts correct timeslot string", () => {
      expect(getSlotFromDateTime("2026-01-21T09:00:00Z")).toBe("09:00 AM");
      expect(getSlotFromDateTime("2026-01-21T11:00:00Z")).toBe("11:00 AM");
      expect(getSlotFromDateTime("2026-01-21T14:00:00Z")).toBe("02:00 PM");
    });
  });

  describe("GET /appointments", () => {
    const handler = getHandler("GET", "/appointments");

    it("returns enriched appointments with names", () => {
      const req = { query: {} } as any;
      const res = createMockRes();

      handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      const first = res.body[0];
      expect(first.clinic_name).toBeDefined();
      expect(first.service_name).toBeDefined();
      expect(first.patient_name).toBeDefined();
    });

    it("filters appointments by patient_id", () => {
      const req = {
        query: { patient_id: "9f0e1d2c-3b4a-5g6h-7i8j-9k0l1m2n3o4p" },
      } as any;
      const res = createMockRes();

      handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(
        res.body.every(
          (apt: any) => apt.patient_id === "9f0e1d2c-3b4a-5g6h-7i8j-9k0l1m2n3o4p"
        )
      ).toBe(true);
    });
  });

  describe("GET /appointments/availability", () => {
    const handler = getHandler("GET", "/appointments/availability");

    it("returns availability slots for a date and clinic", () => {
      const req = {
        query: {
          clinic_id: "3f2504e0-4f89-11d3-9a0c-0305e82c3301",
          date: "2026-05-15",
        },
      } as any;
      const res = createMockRes();

      handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.date).toBe("2026-05-15");
      expect(res.body.all_slots.length).toBe(8);
      expect(Array.isArray(res.body.available_slots)).toBe(true);
    });

    it("returns 400 when clinic_id or date is missing", () => {
      const req = { query: { date: "2026-05-15" } } as any;
      const res = createMockRes();

      handler(req, res);

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /appointment", () => {
    const handler = getHandler("POST", "/appointment");

    it("returns 400 when required fields are missing", () => {
      const req = {
        body: { patient_id: "some-id" },
      } as any;
      const res = createMockRes();

      handler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("Missing required fields");
    });

    it("returns 400 for invalid clinic_id", () => {
      const req = {
        body: {
          patient_id: "550e8400-e29b-41d4-a716-446655440000",
          clinic_id: "invalid-clinic",
          service_id: "3f2504e0-4f89-11d3-9a0c-0305e82c3301",
          appointment_datetime: "2026-06-01T10:00:00Z",
        },
      } as any;
      const res = createMockRes();

      handler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain("Invalid clinic_id");
    });
  });
});
