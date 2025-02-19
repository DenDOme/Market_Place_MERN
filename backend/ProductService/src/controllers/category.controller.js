import Category from "../models/category.model.js";

export const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: "Name field is required" });
    }

    const category = await Category.findOne({ name });
    if (category) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists" });
    }

    const newCategory = new Category({ name });
    await newCategory.save();

    res
      .status(201)
      .json({
        message: "Category successfully created",
        category: newCategory,
      });
  } catch (error) {
    console.error(
      "Error in createCategory | category controller",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Category.deleteOne({ _id: id });
    res.status(200).json({ message: "Category successfully deleted" });
  } catch (error) {
    console.error(
      "Error in deleteCategory | category controller",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const changeCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    if (!id || !name) {
      return res
        .status(400)
        .json({ message: "ID and Name fields are required" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name;
    await category.save();

    res
      .status(200)
      .json({ message: "Category successfully updated", category });
  } catch (error) {
    console.error(
      "Error in changeCategory | category controller",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    console.error(
      "Error in getCategories | category controller",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOneCategory = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ category });
  } catch (error) {
    console.error(
      "Error in getOneCategory | category controller",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};
