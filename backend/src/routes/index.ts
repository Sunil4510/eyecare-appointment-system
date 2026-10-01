/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Router } from "express";
import healthRouter from "./health.routes";
import clinicsRouter from "./clinics.routes";
import usersRouter from "./users.routes";
import opticiansRouter from "./opticians.routes";
import servicesRouter from "./services.routes";
import appointmentsRouter from "./appointments.routes";
import catalogueTableRouter from "./catalogueTable.routes";

const router = Router();

// Healthcheck router has been provided for your convenience
router.use(healthRouter);

/**
 * Following routers have been scaffolded for you.
 * Each router contains basic CRUD endpoints (ie: Get all, Get by ID, Create).
 * You may add in any other additional endpoints as per the requirements.
 */
router.use(clinicsRouter);
router.use(usersRouter);
router.use(opticiansRouter);
router.use(servicesRouter);
router.use(appointmentsRouter);
router.use(catalogueTableRouter);

export default router;
