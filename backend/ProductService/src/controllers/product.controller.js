import cloudinary, { getPublicId } from "../lib/cloudinary.js";
import { publishEvent } from "../lib/rabbitmq.js";
import { getRecommendedProducts } from "../middleware/userProductRecommend.middleware.js";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  const { name, description, price, stock, images, categoryId, userId } =
    req.body;

  try {
    if (!name || !description || !price || !stock || !images || !categoryId) {
      return res.status(400).json({ message: "All field must be provided" });
    }

    const isCategoryExists = await Category.findById(categoryId);

    if (!isCategoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        const response = await cloudinary.uploader.upload(image);
        return response.secure_url;
      })
    );

    const newProduct = new Product({
      userId,
      name,
      description,
      price,
      stock,
      images: uploadedImages,
      categoryId,
    });
    await newProduct.save();

    await publishEvent("product.created", {
      _id: newProduct._id,
      name: newProduct.name,
      price: newProduct.price,
    });

    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.error("Error in createProduct | product controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: "Invalid product" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this product" });
    }

    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        const publicId = image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Product.deleteOne({ _id: id });

    await publishEvent("product.deleted", {
      _id: product._id,
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct | product controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { _id, name, description, price, stock, images, categoryId, userId } =
    req.body;

  try {
    if (!_id) {
      return res.status(400).json({ message: "Invalid Product" });
    }

    const product = await Product.findById(_id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You do not have permission to update this product" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    let updatedImages = product.images;
    if (images && images.length > 0) {
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          const publicId = getPublicId(image);
          await cloudinary.uploader.destroy(publicId);
        }
      }
      updatedImages = [];
      for (const image of images) {
        const uploadedImage = await cloudinary.uploader.upload(image);
        updatedImages.push(uploadedImage.secure_url);
      }
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.images = updatedImages;
    product.categoryId = categoryId || product.categoryId;

    await product.save();

    await publishEvent("product.updated", {
      _id: product._id,
      name: product.name,
      price: product.price,
    });

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error in updateProduct | product controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOneProduct = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Invalid product" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("Error in getOneProduct | product controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const findProductByName = async (req, res) => {
  const { name } = req.query;

  try {
    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }

    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found with that name" });
    }

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error in findProductByName | product controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const findProductsByFilter = async (req, res) => {
  const { priceMin, priceMax, categoryId, stock } = req.query;

  try {
    let filter = {};

    const priceMinNum = priceMin ? Number(priceMin) : null;
    const priceMaxNum = priceMax ? Number(priceMax) : null;
    const stockNum = stock ? Number(stock) : null;

    if (priceMinNum || priceMaxNum) {
      filter.price = {};
      if (priceMinNum) filter.price.$gte = priceMinNum;
      if (priceMaxNum) filter.price.$lte = priceMaxNum;
    }

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (stockNum) {
      filter.stock = { $gte: stockNum };
    }

    const products = await Product.find(filter);

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found matching the filters" });
    }

    res.status(200).json({ products });
  } catch (error) {
    console.error(
      "Error in findProductsByFilter | product controller",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProducts = async (req, res) => {
  const { userId } = req.body;

  try {
    const recommendedProducts = await getRecommendedProducts(userId);

    res.status(200).json({ products: recommendedProducts });
  } catch (error) {
    console.error("Error in getProducts | product controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
