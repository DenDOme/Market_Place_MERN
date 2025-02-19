import redisClient from "../lib/redis.js";
import ProductCache from "../models/productCache.model.js";

export const updateProductCache = async (productId, data) => {
  await ProductCache.updateOne({ productId }, data, { upsert: true });

  await redisClient.set(
    `product:${productId}`,
    JSON.stringify(data),
    "EX",
    3600
  );
};

export const removeProductCache = async (productId) => {
  await ProductCache.deleteOne({ productId });

  await redisClient.del(`product:${productId}`);
};

export const getProductData = async (productId) => {
  let product = await redisClient.get(`product:${productId}`);

  if (!product) {
    console.log("Cache missing, fetching from db");
    product = await ProductCache.findOne({ productId });

    if (product) {
      await redisClient.set(
        `product:${productId}`,
        JSON.stringify(product),
        "EX",
        3600
      );
    }
  } else {
    product = JSON.parse(product);
  }

  return product;
};
