import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = "https://food-del-frontend-m0ak.onrender.com";

  try {
    const { items, amount, address } = req.body;
    const userId =req.userId;
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100, // INR to paisa
      },
      quantity: item.quantity,
    }));

    // Add delivery charges
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 200 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Order placement error:", error);
    return res.json({ success: false, message: "Error placing order" });
  }
}

const verifyOrder = async(req,res) =>{
  const {orderId,success} = req.body;
  try {
    if(success=="true"){
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Order paid successfully" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "not paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
}

//user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({userId:req.userId});
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



