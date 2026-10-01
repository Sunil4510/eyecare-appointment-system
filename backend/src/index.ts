/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import express from "express";
import cors from "cors";
import routes from "./routes";
import { logInfo, logError } from "./utils/logger";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: "*" }));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logInfo(`${req.method} ${req.originalUrl} [${res.statusCode}] - ${duration}ms`, {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration,
    });
  });
  next();
});

app.use(routes);

// Central error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logError("Unhandled error caught by Express middleware", {
    error: err?.message,
    stack: err?.stack,
  });
  res.status(500).json({ error: "Internal Server Error" });
});

let server: any;
if (process.env.NODE_ENV !== "test") {
  server = app.listen(port, () => {
    console.info(`Server listening on localhost:${port}`);
  });

  process.on("SIGINT", () => {
    server?.close(() => {
      process.exit(0);
    });
  });

  process.on("SIGTERM", () => {
    server?.close(() => {
      process.exit(0);
    });
  });
}

export default app;