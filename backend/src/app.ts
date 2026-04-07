import express from "express";
import "express-async-errors"; // important!
import cors from "cors";
import authRoutes from "./routes/auth";
//import metricRoutes from "./routes/metrics.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);

// error handler must be last
app.use(errorHandler);

export default app;
