import { createCart } from "../middleware/cart.middleware.js";

export const addItemCart = async (req, res) => {
    const { id } = req.params; 
    const { userId } = req.user; 

    try {
        if (!id) {
            return res.status(400).json({ message: "Invalid product" });
        }

        const product = await getProductData(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const cart = await createCart(userId);

        const existingItem = cart.items.find(item => item.productId.toString() === id);

        if (existingItem) {
            existingItem.quantity += 1; 
        } else {
            cart.items.push({
                productId: id,
                quantity: 1,
                price: product.price
            });
        }

        await cart.save(); 

        res.status(200).json({ message: "Item added to cart" });
    } catch (error) {
        console.error("Error in addItemCart | cart controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteItemCart = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try {
        if(!id) {
            return res.status(400).json({ message: "Invalid Product" });
        }

        const cart = await createCart(userId);

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === id);

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        if (cart.items[itemIndex].quantity > 1) {
            cart.items[itemIndex].quantity -= 1; 
        } else {
            cart.items.splice(itemIndex, 1);
        }

        await cart.save();

        return res.status(200).json({ message: "Item deleted from the cart" });
    } catch (error) {
        console.error("Error in deleteItemCart | cart controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getCart = async (req, res) => {
    const { userId } = req.user;

    try {
        const cart = await createCart(userId);

        return res.status(200).json({ cart });
    } catch (error) {
        console.error("Error in getCart | cart controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}