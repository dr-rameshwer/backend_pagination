import { getPaginatedUsers, seedUsers } from "../controllers/userController.js";

import express from "express";

const router = express.Router();

router.post("/seed", seedUsers);
router.get("/", getPaginatedUsers);

export default router;
