import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            index: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1 
        },
        price: {
            type: Number,
            required: true,
            min: 0 
        }
    },
    { timestamps: true }
);

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

export default OrderItem;
