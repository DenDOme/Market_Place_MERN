import express from "express";
import {
  createReview,
  deleteReview,
  getReviews,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", createReview);
router.get("/:id", getReviews);
router.delete("/:id", deleteReview);

export default router;
