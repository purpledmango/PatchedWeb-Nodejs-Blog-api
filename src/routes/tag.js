import { Router } from "express";

import { addTag, delteTag, updateTag, getTag } from "../controllers/tagControllers.js";

const router = Router();

router.post("/add", addTag);

router.get("/get/:tid", getTag);

router.delete("/delete/:tid", delteTag);

router.put("/update/:tid", updateTag);


export default router