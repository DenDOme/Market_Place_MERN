import express from "express";
import { createUserAction } from "../controllers/userAction.controller.js";

const router = express.Router();

router.post("/", createUserAction);

export default router;
