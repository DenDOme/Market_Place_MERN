import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        totalPrice: {
            type: Number,
            required: true
        },
        deliveryDate: {
            type: Date,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ["Card", "Cash"],
            default: "Card"
        },
        paymentStatus: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending"
        },
        trackingNumber: {
            type: String,
            unique: true
        }
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
