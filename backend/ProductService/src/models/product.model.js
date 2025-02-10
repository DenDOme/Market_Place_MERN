import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        images: {
            type: [String],
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        rating: {
            type: Number,
            default: 0 
        },
        reviewCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true } 
);

const Product = mongoose.model("Product", productSchema);

export default Product;
