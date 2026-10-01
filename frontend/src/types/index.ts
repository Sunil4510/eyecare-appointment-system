/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

export interface IConfig {
  backendURL: string;
}

export type BookingDetails = {
  service: string;
  clinic: string;
  optician: string;
  date: string;
  time: string;
  notes: string;
  emailConfirmation: string;
};

export interface CatalogueRow {
  service: {
    id: string;
    name: string;
    description?: string;
  };
  clinic: {
    id: string;
    name: string;
    address?: string;
    opticians: {
      id: string;
      name: string;
    }[];
  };
}
