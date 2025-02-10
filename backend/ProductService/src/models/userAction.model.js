import mongoose from 'mongoose';

const userActionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    },
    { timestamps: true }
);

const UserAction = mongoose.model("UserAction", userActionSchema);

export default UserAction;
