import { Router } from "express";
import fs from 'fs';
import path from "path";
import { topThreeArticles, allArticles } from "../controllers/clientController.js";

import PostModel from "../models/postM.js";

const uploadFolder = 'uploads/';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

const router = Router();

router.get("/top-3", topThreeArticles);
router.get("/all-articles", allArticles);
router.get('/get-post/:slug', async (req, res) => {
    try {
        const { slug } = req.params; // Use req.params instead of req.params.slug

        const article = await PostModel.findOne({ slug: slug });

        if (!article) {
            res.status(404).json({ message: "Article not Found" });
        }

        res.status(200).json({
            message: "Article Fetched",
            data: article
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.get('/uploads/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', uploadFolder, filename);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ message: 'File not found' });
    }
});

export default router;
