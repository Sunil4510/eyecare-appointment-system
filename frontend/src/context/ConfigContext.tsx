/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { getConfig } from "../services/configService";
import { createContext, ReactNode, useContext } from "react";
import { IConfig } from "../types";
import type { FC } from "react";

const ConfigContext = createContext<IConfig | undefined>(undefined);

const useConfig = (): IConfig => {
  const context = useContext(ConfigContext);

  if (!context) {
    throw new Error("UseConfig must be used within a ConfigProvider");
  }
  return context;
};

export const ConfigProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const config = getConfig();
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};

export { useConfig };
