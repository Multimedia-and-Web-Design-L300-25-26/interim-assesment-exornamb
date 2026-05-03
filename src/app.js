import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import cryptoApiRoutes from "./routes/cryptoRoutes.js";
import profileRoutes from "./routes/profile.js";
import patchProfileRoutes from "./routes/patchProfile.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", 
    credentials: true
}));

app.use("/auth", authRoutes);
app.use("/api/crypto", cryptoApiRoutes);
app.use("/api", profileRoutes);
app.use("/api", patchProfileRoutes);

// Swagger Documentation Route
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root Welcome Route
app.get("/", (req, res) => {
  res.json("welcome to coinbase clone backend type /docs to see the documentation");
});

export default app;
