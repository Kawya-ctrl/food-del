import userModel from "../models/userModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
  try {
    const userId = req.userId; // Get from middleware
    const itemId = req.body.itemId;

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};

    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Item added to cart", cartData });
  } catch (error) {
    console.error("addToCart error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const itemId = req.body.itemId;

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};

    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Removed from cart", cartData });
  } catch (error) {
    console.error("removeFromCart error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Fetch user cart data
const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.error("getCart error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { addToCart, removeFromCart, getCart };
