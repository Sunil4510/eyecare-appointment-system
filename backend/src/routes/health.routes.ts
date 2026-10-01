/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Router } from "express";
import * as path from "path";
import * as fs from "fs";

const healthRouter = Router();


/** 
 * The provided health check endpoint to verify that the server is running
 * and all seed data files are present.
 * You may modify this endpoint if needed.
 */
healthRouter.get('/health', (req, res) => {
  const seedFiles = [
    "seed_data_clinics.json",
    "seed_data_users.json",
    "seed_data_services.json",
    "seed_data_appointments.json",
    "seed_data_opticians.json"
  ];

  const missingFiles = seedFiles.filter(file => !fs.existsSync(path.join(__dirname, `../seed_data/${file}`)));
  if (missingFiles.length > 0) {
    res.status(500).json({ error: "Missing seed data files", missingFiles });
  } else {
    res.json({
      status: 'OK - Healthy',
      description: `All seed files loaded: [${seedFiles.join(', ')}]`,
      timestamp: new Date().toISOString()
    });
  }
});

export default healthRouter;
