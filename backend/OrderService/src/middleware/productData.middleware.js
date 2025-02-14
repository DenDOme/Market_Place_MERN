import { removeProductCache, updateProductCache } from "../controllers/productCache.controller";


export const updateCache = async (data) => {
    const { productId, name, price } = data;
    await updateProductCache(productId, { name, price });
};

export const removeCache = async (productId) => {
    await removeProductCache(productId);
};