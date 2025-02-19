import Favourite from "../models/favourite.model.js";
import Product from "../models/product.model.js";

export const createFavourite = async (req, res) => {
  const { productId, userId } = req.body;

  try {
    if (!productId) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const existingFavourite = await Favourite.findOne({ userId, productId });
    if (existingFavourite) {
      return res
        .status(409)
        .json({ message: "This product is already in your favorites" });
    }

    const isProductExists = await Product.findById(productId);
    if (!isProductExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newFavourite = new Favourite({ userId, productId });
    await newFavourite.save();

    return res.status(201).json({
      message: "Product successfully added to favorites",
      favourite: newFavourite,
    });
  } catch (error) {
    console.error(
      "Error in createFavourite | favourite controller",
      error.message
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteFavourite = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: "Invalid Product" });
    }

    const existingFavourite = await Favourite.findOne({ userId, id });
    if (!existingFavourite) {
      return res
        .status(404)
        .json({ message: "Product not found in your favorites" });
    }

    await existingFavourite.deleteOne();

    return res
      .status(200)
      .json({ message: "Favorite product deleted successfully" });
  } catch (error) {
    console.error(
      "Error in deleteFavourite | favourite controller",
      error.message
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFavourites = async (req, res) => {
  const { userId } = req.body;

  try {
    const favourites = await Favourite.find({ userId });

    return res.status(200).json({ favourites });
  } catch (error) {
    console.error(
      "Error in getFavourites | favourite controller",
      error.message
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOneFavourite = async (req, res) => {
  const { id } = req.params;

  try {
    const favourite = await Favourite.findById(id);
    if (!favourite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    return res.status(200).json({ favourite });
  } catch (error) {
    console.error(
      "Error in getOneFavourite | favourite controller",
      error.message
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
