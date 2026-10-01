/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Router } from "express";
import { CatalogueRow, Clinic, Optician, Service } from "../types/shared";
import { getFileData } from "../utils";
import { logError } from "../utils/logger";

const catalogueTableRouter = Router();

catalogueTableRouter.get("/catalogue-table", (req, res) => {
  try {
    const services = getFileData("services") as Service[];
    const clinics = getFileData("clinics") as Clinic[];
    const opticians = getFileData("opticians") as Optician[];

    let data: CatalogueRow[] = services.flatMap((service) => {
      const associatedClinics = clinics
        .map((clinic) => {
          const clinicOpticians = clinic.opticians
            .map((opticianId) =>
              opticians.find((optician) => optician.id === opticianId)
            )
            .filter(Boolean) as Optician[];

          return {
            id: clinic.id,
            name: clinic.name,
            address: clinic.address,
            opticians: clinicOpticians.map((optician) => ({
              id: optician.id,
              name: optician.name,
            })),
          };
        })
        .filter((clinic) => clinic.opticians.length > 0);

      return associatedClinics.map(
        (clinic) =>
          ({
            service: {
              id: service.id,
              name: service.name,
              description: service.description,
            },
            clinic,
          } as CatalogueRow)
      );
    });

    res.json(data);
  } catch (error: any) {
    logError("Failed to fetch catalogue table", { error: error?.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default catalogueTableRouter;
