import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product.js";

const router = express.Router();

// Alle Produkte abrufen
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Fehler beim Abrufen der Produkte" });
    }
});

// Produkt nach ID abrufen
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Produkt nicht gefunden" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Fehler beim Abrufen des Produkts" });
    }
});

// Speicherort für Bilder definieren
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Eindeutiger Dateiname
    },
});

const upload = multer({ storage });

// Bild hochladen + Produkt speichern
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { name, price, shortDescription, longDescription, category, sale } = req.body;
        const imagePath = `/uploads/${req.file.filename}`;

        const product = new Product({
            name,
            price,
            shortDescription,
            longDescription,
            imagePath,
            category,
            sale
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Hochladen", error });
    }
});

export default router;
