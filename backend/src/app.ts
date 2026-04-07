import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/healthcheck", (_req, res) => {
  res.json({ status: "OK" });
});

if (process.env.NODE_ENV !== "test") {
  const { default: authRoutes } = await import("./routes/auth.js");
  const { default: metricsRoutes } = await import("./routes/metrics.js");

  app.use("/api", authRoutes);
  app.use("/api/metrics", metricsRoutes);
}

app.use(errorHandler);

export default app;
