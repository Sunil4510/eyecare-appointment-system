/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Router } from "express";
import { addNewDataToFile, generateUUID, getEntityById, getFileData } from "../utils";
import { Optician } from "../types/shared";
import { logError, logInfo } from "../utils/logger";

const opticiansRouter = Router();

/************************ Provided Basic CRUD Endpoints ****************************/

// Get all opticians
opticiansRouter.get("/opticians", (req, res) => {
  try {
    const data = getFileData("opticians") as Optician[];
    res.json(data);
  } catch (error: any) {
    logError("Failed to fetch opticians", { error: error?.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get an optician by ID
opticiansRouter.get("/optician/:id", (req, res) => {
  try {
    const optician = getEntityById<Optician>("opticians", req.params.id);
    if (optician) {
      res.json(optician);
    } else {
      res.status(404).json({ error: "Optician not found" });
    }
  } catch (error: any) {
    logError("Failed to fetch optician by ID", { id: req.params.id, error: error?.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create an optician
opticiansRouter.post("/optician", (req, res) => {
  const newOptician = req.body;
  try {
    if (!newOptician.name) {
      res.status(400).json({ error: "Optician name is required" });
      return;
    }
    const createdOptician: Optician = {
      id: newOptician.id || generateUUID(),
      name: newOptician.name,
      intro: newOptician.intro || "",
      services_id: newOptician.services_id || [],
    };
    addNewDataToFile<Optician>("opticians", createdOptician);
    logInfo("Optician created", { opticianId: createdOptician.id, name: createdOptician.name });
    res.status(201).json({ message: "Optician added successfully", data: createdOptician });
  } catch (error: any) {
    logError("Failed to create optician", { error: error?.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default opticiansRouter;
