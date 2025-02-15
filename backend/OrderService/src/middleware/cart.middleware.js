import Cart from "../models/cart.model.js";

export const createCart = async (userId) => {
    try {
        if (!userId) {
            throw new Error("Invalid user");
        }

        let cart = await Cart.findOne({ userId });

        if (cart) {
            return cart; 
        }

        cart = new Cart({ userId });
        await cart.save(); 

        return cart;
    } catch (error) {
        console.error("Error in createCart | cart middleware:", error.message);
        throw error; 
    }
};