import express from "express";
import {
  changeCategory,
  createCategory,
  deleteCategory,
  getCategories,
  getOneCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/categories", getCategories);
router.get("/:id", getOneCategory);
router.put("/:id", changeCategory);
router.delete("/:id", deleteCategory);

export default router;
