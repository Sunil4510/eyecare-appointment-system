/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
