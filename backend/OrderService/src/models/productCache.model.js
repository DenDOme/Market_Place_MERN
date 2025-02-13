import mongoose from "mongoose";

const productCacheSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
        },
        price: {
            type: Number
        }
    }
);

const ProductCache = mongoose.model("ProductCache", productCacheSchema);

export default ProductCache;