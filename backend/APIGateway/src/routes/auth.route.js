import express from "express";
import redirectMiddleware from "../middlewares/redirect.middleware.js";
import {
  authenticateUser,
  checkUserRole,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/users", redirectMiddleware);

router.post("/sessions", redirectMiddleware);

router.delete("/sessions", redirectMiddleware);

router.post("/password/reset-request", redirectMiddleware);
router.post("/password/check", redirectMiddleware);
router.post("/password/reset", redirectMiddleware);

router.put("/profile", authenticateUser, redirectMiddleware);

router.put("/users/:id/role", checkUserRole, redirectMiddleware);

router.get("/check-user", authenticateUser, redirectMiddleware);

export default router;
