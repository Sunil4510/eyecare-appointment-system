/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { IConfig } from "../types";

export const getConfig = (): IConfig => {
  return {
    backendURL: (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:3001",
  };
};
