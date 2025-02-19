import Category from "../models/category.model.js";
import UserAction from "../models/userAction.model.js";

export const createUserAction = async (req, res) => {
  const { userId, categoryId } = req.body;

  try {
    if (!categoryId) {
      return res.status(400).json({ message: "category not provided" });
    }

    const isCategoryExists = await Category.findById(categoryId);
    if (!isCategoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const isUserActionExists = await UserAction.findOne({ userId, categoryId });

    if (!isUserActionExists) {
      const newUserAction = new UserAction({
        userId,
        categoryId,
        quantity: 1,
      });

      await newUserAction.save();
      return res.status(201).json({ message: "User action created" });
    } else {
      const ExistingUserAction = await UserAction.findOne({
        userId,
        categoryId,
      });
      ExistingUserAction.quantity += 1;
      await ExistingUserAction.save();
      return res.status(200).json({ message: "User action updated" });
    }
  } catch (error) {
    console.error(
      "Error in createUserAction | userAction controller",
      error.message
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
