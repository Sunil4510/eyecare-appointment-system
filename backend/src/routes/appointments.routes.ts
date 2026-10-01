import { Router } from "express";
import { Appointment, Clinic, Optician, Service, User } from "../types/shared";
import { addNewDataToFile, generateUUID, getEntityById, getFileData } from "../utils";
import { logError, logInfo } from "../utils/logger";

const appointmentsRouter = Router();

const ALL_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
] as const;

export const TIMESLOT_MAP: Record<string, string> = {
  "09:00 AM": "09:00:00",
  "10:00 AM": "10:00:00",
  "11:00 AM": "11:00:00",
  "01:00 PM": "13:00:00",
  "02:00 PM": "14:00:00",
  "03:00 PM": "15:00:00",
  "04:00 PM": "16:00:00",
  "05:00 PM": "17:00:00",
};

// Helper: Extract YYYY-MM-DD from datetime string safely
export function getDateString(datetime: string): string {
  const match = datetime.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) return match[1];
  const d = new Date(datetime);
  if (!isNaN(d.getTime())) {
    return d.toISOString().substring(0, 10);
  }
  return "";
}

// Helper: Extract standard timeslot string ("09:00 AM") from datetime
export function getSlotFromDateTime(datetime: string): string {
  const hourMatch = datetime.match(/T(\d{2}):/);
  if (hourMatch) {
    const h = parseInt(hourMatch[1], 10);
    if (h === 9) return "09:00 AM";
    if (h === 10) return "10:00 AM";
    if (h === 11) return "11:00 AM";
    if (h === 13) return "01:00 PM";
    if (h === 14) return "02:00 PM";
    if (h === 15) return "03:00 PM";
    if (h === 16) return "04:00 PM";
    if (h === 17) return "05:00 PM";
  }
  for (const slot of ALL_SLOTS) {
    if (datetime.includes(slot)) return slot;
  }
  return "";
}

// Helper: Enrich appointment with human readable names
function enrichAppointment(
  apt: Appointment,
  clinics: Clinic[],
  services: Service[],
  opticians: Optician[],
  users: User[]
): Appointment {
  const clinic = clinics.find((c) => c.id === apt.clinic_id);
  const opticianId = apt.optician_id || clinic?.opticians?.[0];
  const optician = opticians.find((o) => o.id === opticianId);
  const service = services.find((s) => s.id === apt.service_id);
  const patient = users.find((u) => u.id === apt.patient_id);

  return {
    ...apt,
    optician_id: opticianId,
    clinic_name: clinic?.name || "Unknown Clinic",
    service_name: service?.name || "Unknown Service",
    optician_name: optician?.name || "Unknown Optician",
    patient_name: patient
      ? `${patient.first_name} ${patient.last_name}`.trim()
      : "Unknown Patient",
  };
}

/************************ Provided Basic CRUD Endpoints ****************************/

// Get all appointments (with optional filters: patient_id, optician_id, clinic_id, date)
appointmentsRouter.get("/appointments", (req, res) => {
  try {
    const rawAppointments = getFileData("appointments") as Appointment[];
    const clinics = getFileData("clinics") as Clinic[];
    const services = getFileData("services") as Service[];
    const opticians = getFileData("opticians") as Optician[];
    const users = getFileData("users") as User[];

    const enriched = rawAppointments.map((apt) =>
      enrichAppointment(apt, clinics, services, opticians, users)
    );

    let filtered = enriched;

    const { patient_id, optician_id, clinic_id, date } = req.query;

    if (patient_id) {
      filtered = filtered.filter((apt) => apt.patient_id === patient_id);
    }

    if (optician_id) {
      filtered = filtered.filter((apt) => {
        if (apt.optician_id === optician_id) return true;
        const clinic = clinics.find((c) => c.id === apt.clinic_id);
        return clinic?.opticians?.includes(optician_id as string);
      });
    }

    if (clinic_id) {
      filtered = filtered.filter((apt) => apt.clinic_id === clinic_id);
    }

    if (date) {
      filtered = filtered.filter((apt) => getDateString(apt.appointment_datetime) === date);
    }

    // Sort by datetime ascending
    filtered.sort((a, b) =>
      new Date(a.appointment_datetime).getTime() - new Date(b.appointment_datetime).getTime()
    );

    res.json(filtered);
  } catch (error: any) {
    logError("Failed to fetch appointments", { error: error?.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Check availability for a specific clinic, optician, and date
appointmentsRouter.get("/appointments/availability", (req, res) => {
  const { clinic_id, optician_id, date } = req.query;

  if (!clinic_id || !date) {
    res.status(400).json({ error: "clinic_id and date are required" });
    return;
  }

  try {
    const rawAppointments = getFileData("appointments") as Appointment[];
    const clinics = getFileData("clinics") as Clinic[];
    const targetDate = String(date).trim();

    // Determine optician ID
    let targetOpticianId = optician_id as string;
    if (!targetOpticianId) {
      const clinic = clinics.find((c) => c.id === clinic_id);
      targetOpticianId = clinic?.opticians?.[0] || "";
    }

    // Rule 4: Each optician can only be at 1 clinic in a day
    // Check if this optician has any appointment at a DIFFERENT clinic on this date
    const conflictingAppointment = rawAppointments.find((apt) => {
      const aptDate = getDateString(apt.appointment_datetime);
      if (aptDate !== targetDate) return false;

      const aptOpticianId = apt.optician_id || clinics.find((c) => c.id === apt.clinic_id)?.opticians?.[0];
      return aptOpticianId === targetOpticianId && apt.clinic_id !== clinic_id;
    });

    if (conflictingAppointment) {
      logInfo("Optician scheduled at different clinic on this date", {
        opticianId: targetOpticianId,
        date: targetDate,
        otherClinicId: conflictingAppointment.clinic_id,
      });
      res.json({
        date: targetDate,
        clinic_id,
        optician_id: targetOpticianId,
        all_slots: ALL_SLOTS,
        booked_slots: [...ALL_SLOTS],
        available_slots: [],
        conflict: true,
        conflict_reason: "Optician is already scheduled at another clinic on this date.",
      });
      return;
    }

    // Find booked slots for this optician or clinic on target date
    const bookedSlotsOnDate = new Set<string>();
    for (const apt of rawAppointments) {
      if (getDateString(apt.appointment_datetime) === targetDate) {
        const aptOpticianId = apt.optician_id || clinics.find((c) => c.id === apt.clinic_id)?.opticians?.[0];
        if (aptOpticianId === targetOpticianId || apt.clinic_id === clinic_id) {
          const slot = getSlotFromDateTime(apt.appointment_datetime);
          if (slot) {
            bookedSlotsOnDate.add(slot);
          }
        }
      }
    }

    const available_slots = ALL_SLOTS.filter((s) => !bookedSlotsOnDate.has(s));

    res.json({
      date: targetDate,
      clinic_id,
      optician_id: targetOpticianId,
      all_slots: ALL_SLOTS,
      booked_slots: Array.from(bookedSlotsOnDate),
      available_slots,
      conflict: false,
    });
  } catch (error: any) {
    logError("Failed to calculate availability", { error: error?.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get an appointment by ID
appointmentsRouter.get("/appointment/:id", (req, res) => {
  try {
    const rawAppointment = getEntityById<Appointment>("appointments", req.params.id);
    if (!rawAppointment) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }
    const clinics = getFileData("clinics") as Clinic[];
    const services = getFileData("services") as Service[];
    const opticians = getFileData("opticians") as Optician[];
    const users = getFileData("users") as User[];

    const enriched = enrichAppointment(rawAppointment, clinics, services, opticians, users);
    res.json(enriched);
  } catch (error: any) {
    logError("Failed to get appointment by ID", { id: req.params.id, error: error?.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create an appointment
appointmentsRouter.post("/appointment", (req, res) => {
  const newAppointment = req.body;
  try {
    const { patient_id, clinic_id, service_id, appointment_datetime } = newAppointment;

    if (!patient_id || !clinic_id || !service_id || !appointment_datetime) {
      res.status(400).json({
        error: "Missing required fields: patient_id, clinic_id, service_id, and appointment_datetime are required.",
      });
      return;
    }

    const clinics = getFileData("clinics") as Clinic[];
    const services = getFileData("services") as Service[];
    const opticians = getFileData("opticians") as Optician[];
    const existingAppointments = getFileData("appointments") as Appointment[];

    // Verify clinic exists
    const clinic = clinics.find((c) => c.id === clinic_id);
    if (!clinic) {
      res.status(400).json({ error: "Invalid clinic_id: clinic does not exist." });
      return;
    }

    // Verify service exists
    const service = services.find((s) => s.id === service_id);
    if (!service) {
      res.status(400).json({ error: "Invalid service_id: service does not exist." });
      return;
    }

    // Determine optician
    const opticianId = newAppointment.optician_id || clinic.opticians?.[0];
    const targetDate = getDateString(appointment_datetime);
    const targetSlot = getSlotFromDateTime(appointment_datetime);

    // Rule 4: Each optician can only be at 1 clinic in a day
    const conflictingApt = existingAppointments.find((apt) => {
      const aptDate = getDateString(apt.appointment_datetime);
      if (aptDate !== targetDate) return false;
      const aptOpticianId = apt.optician_id || clinics.find((c) => c.id === apt.clinic_id)?.opticians?.[0];
      return aptOpticianId === opticianId && apt.clinic_id !== clinic_id;
    });

    if (conflictingApt) {
      res.status(400).json({
        error: "This optician is already scheduled at a different clinic on this date.",
      });
      return;
    }

    // Check double-booking for the optician or timeslot
    const slotBooked = existingAppointments.some((apt) => {
      if (getDateString(apt.appointment_datetime) !== targetDate) return false;
      const aptOpticianId = apt.optician_id || clinics.find((c) => c.id === apt.clinic_id)?.opticians?.[0];
      const slot = getSlotFromDateTime(apt.appointment_datetime);
      return aptOpticianId === opticianId && slot === targetSlot;
    });

    if (slotBooked) {
      res.status(400).json({
        error: "This timeslot is already booked for this optician.",
      });
      return;
    }

    const appointmentToSave: Appointment = {
      id: newAppointment.id || generateUUID(),
      patient_id,
      clinic_id,
      service_id,
      optician_id: opticianId,
      appointment_datetime,
      notes: newAppointment.notes || "",
    };

    addNewDataToFile<Appointment>("appointments", appointmentToSave);
    logInfo("Appointment created successfully", {
      appointmentId: appointmentToSave.id,
      patientId: patient_id,
      clinicId: clinic_id,
      datetime: appointment_datetime,
    });

    const users = getFileData("users") as User[];
    const enriched = enrichAppointment(appointmentToSave, clinics, services, opticians, users);

    res.status(201).json({
      message: "Appointment added successfully",
      data: enriched,
    });
  } catch (error: any) {
    logError("Failed to create appointment", { error: error?.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default appointmentsRouter;

