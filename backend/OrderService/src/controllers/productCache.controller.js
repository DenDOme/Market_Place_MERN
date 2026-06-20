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
  if (product) return JSON.parse(product);

  product = await ProductCache.findOne({ productId });
  if (product) {
    await redisClient.set(`product:${productId}`, JSON.stringify(product), "EX", 3600);
    return product;
  }

  try {
    const response = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL}/product-service/product/${productId}`
    );
    const data = response.data.product;
    if (data) {
      await updateProductCache(productId, { productId, name: data.name, price: data.price });
    }
    return data;
  } catch (err) {
    console.error("Fallback fetch failed:", err.message);
    return null;
  }
};
