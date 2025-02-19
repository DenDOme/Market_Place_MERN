import express from "express";
import {
  createFavourite,
  deleteFavourite,
  getFavourites,
  getOneFavourite,
} from "../controllers/favourite.controller.js";

const router = express.Router();

router.post("/favourites", createFavourite);
router.get("/favourites", getFavourites);
router.get("/favourites/:id", getOneFavourite);
router.delete("/favourites/:id", deleteFavourite);

export default router;
