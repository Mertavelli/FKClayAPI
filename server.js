import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import winston from "winston";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Logging
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

// Routen
app.use("/routes", productRoutes);

// Statische Datei-Antwort für Uploads
app.use("/uploads", express.static("uploads"));

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

if (!MONGODB_URI) {
  logger.error("❌ Fehlende MONGODB_URI in .env Datei");
  throw new Error("Fehlende MONGODB_URI in .env Datei");
}

mongoose
  .connect(MONGODB_URI)
  .then(() => logger.info("✅ MongoDB verbunden"))
  .catch((err) => logger.error("❌ MongoDB Fehler:", err));

app.listen(PORT, () => logger.info(`✅ Server läuft auf Port ${PORT}`));
