import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth";
import metricsRoutes from "./routes/metrics";
import { errorHandler } from "./middleware/errorHandler";
import logger from "./utils/logger";
import "express-async-errors"; // ensures async errors bubble to error handler

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api", authRoutes);      // register/login at /api/register, /api/login
app.use("/api/metrics", metricsRoutes);

// quick healthcheck
app.get("/api/healthcheck", (req, res) => res.json({ status: "OK" }));

// error handler last
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
