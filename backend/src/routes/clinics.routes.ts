/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Router } from "express";
import { Clinic } from "../types/shared";
import { addNewDataToFile, generateUUID, getEntityById, getFileData } from "../utils";
import { logError, logInfo } from "../utils/logger";

const clinicsRouter = Router();

/************************ Provided Basic CRUD Endpoints ****************************/

// Get all clinics
clinicsRouter.get("/clinics", (req, res) => {
  try {
    const data = getFileData("clinics") as Clinic[];
    res.json(data);
  } catch (error: any) {
    logError("Failed to fetch clinics", { error: error?.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a clinic by ID
clinicsRouter.get("/clinic/:id", (req, res) => {
  try {
    const clinic = getEntityById<Clinic>("clinics", req.params.id);
    if (clinic) {
      res.json(clinic);
    } else {
      res.status(404).json({ error: "Clinic not found" });
    }
  } catch (error: any) {
    logError("Failed to fetch clinic by ID", { id: req.params.id, error: error?.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a clinic
clinicsRouter.post("/clinic", (req, res) => {
  const newClinic = req.body;
  try {
    if (!newClinic.name) {
      res.status(400).json({ error: "Clinic name is required" });
      return;
    }
    const createdClinic: Clinic = {
      id: newClinic.id || generateUUID(),
      name: newClinic.name,
      description: newClinic.description || "",
      address: newClinic.address || "",
      opticians: newClinic.opticians || [],
      contact: newClinic.contact || "",
    };
    addNewDataToFile<Clinic>("clinics", createdClinic);
    logInfo("Clinic created", { clinicId: createdClinic.id, name: createdClinic.name });
    res.status(201).json({ message: "Clinic added successfully", data: createdClinic });
  } catch (error: any) {
    logError("Failed to create clinic", { error: error?.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default clinicsRouter;
