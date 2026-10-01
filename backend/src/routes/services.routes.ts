/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Router } from "express";
import { Service } from "../types/shared";
import { addNewDataToFile, generateUUID, getEntityById, getFileData } from "../utils";
import { logError, logInfo } from "../utils/logger";

const servicesRouter = Router();

/************************ Provided Basic CRUD Endpoints ****************************/

// Get all services
servicesRouter.get("/services", (req, res) => {
  try {
    const data = getFileData("services") as Service[];
    res.json(data);
  } catch (error: any) {
    logError("Failed to fetch services", { error: error?.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a service by ID
servicesRouter.get("/service/:id", (req, res) => {
  try {
    const service = getEntityById<Service>("services", req.params.id);
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  } catch (error: any) {
    logError("Failed to fetch service by ID", { id: req.params.id, error: error?.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a service
servicesRouter.post("/service", (req, res) => {
  const newService = req.body;
  try {
    if (!newService.name) {
      res.status(400).json({ error: "Service name is required" });
      return;
    }
    const createdService: Service = {
      id: newService.id || generateUUID(),
      name: newService.name,
      description: newService.description || "",
    };
    addNewDataToFile<Service>("services", createdService);
    logInfo("Service created", { serviceId: createdService.id, name: createdService.name });
    res.status(201).json({ message: "Service added successfully", data: createdService });
  } catch (error: any) {
    logError("Failed to create service", { error: error?.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default servicesRouter;
