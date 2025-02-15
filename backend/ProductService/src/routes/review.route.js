import express from 'express';
import { createReview, deleteReview, getReviews } from '../controllers/review.controller.js';

const router = express.Router();

router.post("/reviews", createReview);
router.get("/reviews", getReviews);
router.delete("/reviews/:id", deleteReview);

export default router;