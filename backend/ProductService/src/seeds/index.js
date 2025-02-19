import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

config();

const seedCategories = [
  { name: "Electronics" },
  { name: "Fashion" },
  { name: "Home & Garden" },
  { name: "Sports & Outdoors" },
  { name: "Books" },
  { name: "Toys & Games" },
  { name: "Health & Beauty" },
  { name: "Automotive" },
];

const seedProducts = [
  {
    name: "Smartphone",
    description: "Latest model smartphone with advanced features.",
    price: 699.99,
    stock: 100,
    images: [
      "https://example.com/smartphone1.jpg",
      "https://example.com/smartphone2.jpg",
    ],
  },
  {
    name: "Laptop",
    description: "High-performance laptop for gaming and work.",
    price: 1299.99,
    stock: 50,
    images: [
      "https://example.com/laptop1.jpg",
      "https://example.com/laptop2.jpg",
    ],
  },
  {
    name: "Sneakers",
    description: "Comfortable running shoes for athletes.",
    price: 89.99,
    stock: 200,
    images: [
      "https://example.com/sneakers1.jpg",
      "https://example.com/sneakers2.jpg",
    ],
  },
  {
    name: "Yoga Mat",
    description: "Non-slip yoga mat for home or gym use.",
    price: 19.99,
    stock: 300,
    images: [
      "https://example.com/yogamat1.jpg",
      "https://example.com/yogamat2.jpg",
    ],
  },
  {
    name: "Reading Glasses",
    description: "Stylish reading glasses for all ages.",
    price: 25.99,
    stock: 150,
    images: [
      "https://example.com/glasses1.jpg",
      "https://example.com/glasses2.jpg",
    ],
  },
  {
    name: "Action Figure",
    description: "Collectible superhero action figure.",
    price: 29.99,
    stock: 120,
    images: [
      "https://example.com/actionfigure1.jpg",
      "https://example.com/actionfigure2.jpg",
    ],
  },
  {
    name: "Blender",
    description: "High-power blender for smoothies and shakes.",
    price: 79.99,
    stock: 80,
    images: [
      "https://example.com/blender1.jpg",
      "https://example.com/blender2.jpg",
    ],
  },
  {
    name: "Car Battery",
    description: "Reliable car battery for all vehicle types.",
    price: 129.99,
    stock: 40,
    images: [
      "https://example.com/battery1.jpg",
      "https://example.com/battery2.jpg",
    ],
  },
];

const seedDatabase = async () => {
  const userId = "67af9d1aa8a679678f1151d0";

  try {
    await connectDB();

    const categories = await Category.insertMany(seedCategories);
    console.log("Categories seeded successfully");

    const productsWithCategories = seedProducts.map((product) => {
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];
      return {
        ...product,
        categoryId: randomCategory._id,
        userId: userId,
      };
    });

    await Product.insertMany(productsWithCategories);
    console.log("Products seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase();
