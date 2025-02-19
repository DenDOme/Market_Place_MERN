import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";

export const createOrder = async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = new Order({
      userId,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice,
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      address: req.body.address,
      paymentMethod: req.body.paymentMethod || "Card",
      paymentStatus: false,
      status: "Pending",
      trackingNumber: `TRK-${Date.now()}`,
    });

    await newOrder.save();

    await Cart.updateOne({ userId }, { $set: { items: [] } });

    res.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    console.error("Error in createOrder | order controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrders = async (req, res) => {
  const { userId } = req.body;

  try {
    const orders = await Order.find({ userId }).populate("items.productId");

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error in getOrders | order controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOneOrder = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const order = await Order.findOne({ _id: id, userId }).populate(
      "items.productId"
    );

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or access denied" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error in getOneOrder | order controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const order = await Order.findOne({ _id: id, userId });

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or access denied" });
    }

    await Order.deleteOne({ _id: id });

    return res.status(200).json({ message: "Order successfully deleted" });
  } catch (error) {
    console.error("Error in deleteOrder | order controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const changeOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, userId } = req.body;

  try {
    d;
    const order = await Order.findOne({ _id: id, userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await Order.updateOne({ _id: id }, { $set: { status: status } });

    res.status(200).json({ message: "Order status changed successfully" });
  } catch (error) {
    console.error("Error in changeOrderStatus | order controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
