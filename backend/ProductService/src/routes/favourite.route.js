import express from "express";
import {
  createFavourite,
  deleteFavourite,
  getFavourites,
  getOneFavourite,
} from "../controllers/favourite.controller.js";

const router = express.Router();

router.post("/", createFavourite);
router.get("/favourites", getFavourites);
router.get("/:id", getOneFavourite);
router.delete("/:id", deleteFavourite);

export default router;
