import express from 'express';
import { createResidency, getAllResidencies, getResidency } from '../controllers/residencyController.js';

const router = express.Router();

router.post("/create", jwtCheck, createResidency);
router.get("/allresidencies", getAllResidencies);
router.get("/:id", getResidency)

export default router;  // ✅ Export default
