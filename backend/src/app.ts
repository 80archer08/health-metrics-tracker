import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import metricsRoutes from "./routes/metrics";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/healthcheck", (_req, res) => {
  res.json({ status: "OK" });
});

if (process.env.NODE_ENV !== "test") {
  app.use("/api", authRoutes);
  app.use("/api/metrics", metricsRoutes);
}

app.use(errorHandler);

export default app;
