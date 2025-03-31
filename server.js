import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js"

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/routes", productRoutes);
app.use("/uploads", express.static("uploads"));


const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

if (!MONGODB_URI) {
  throw new Error("Fehlende MONGODB_URI in .env Datei");
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch((err) => console.error("❌ MongoDB Fehler:", err));

app.listen(PORT, () => console.log(`✅ Server läuft auf Port ${PORT}`));

