import {
  removeProductCache,
  updateProductCache,
} from "../controllers/productCache.controller.js";

export const updateCache = async (data) => {
  const { _id, name, price } = data;
  await updateProductCache(_id, { name, price });
};

export const removeCache = async (productId) => {
  await removeProductCache(productId);
};
