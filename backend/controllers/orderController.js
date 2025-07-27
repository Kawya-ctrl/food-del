import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Place order and create Stripe checkout session
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    const userId = req.userId;
    const { items, amount, address, paymentMethod } = req.body;

    if (!items || !amount || !address || !Array.isArray(items) || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Invalid order data" });
    }

    // Log incoming order for debugging
    console.log("Received order:", req.body);

    // If payment method is COD, save order and return success
    if (paymentMethod === "COD") {
      const newOrder = new orderModel({
        userId,
        items,
        amount,
        address,
        payment: false,
        status: "Food Processing",
        paymentMethod: "COD",
      });
      await newOrder.save();
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      return res.json({ success: true, cod: true, message: "Order placed with Cash on Delivery" });
    }

    // Otherwise, proceed with Stripe
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false,
      status: "Food Processing",
      paymentMethod: "Stripe",
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Prepare Stripe line items
    const line_items = items.map((item) => {
      if (typeof item.price !== "number" || item.price <= 0) {
        throw new Error(`Invalid price for item: ${item.name}`);
      }

      return {
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    });

    // Add delivery charges
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 200,
      },
      quantity: 1,
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};

// Verify payment and update/delete order
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Order paid successfully" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Order cancelled / not paid" });
    }
  } catch (error) {
    console.error("verifyOrder error:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

// Return orders for logged-in user
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("userOrders error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// Listing all orders (admin)
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("listOrders error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//api for updating order status
const updateStatus = async (req,res) => {
  try{
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Order status updated successfully" });
  }catch(error) {
    res.json({ success: false, message: "Failed to update order status" });
  }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
