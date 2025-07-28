import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import userRouter from "./routes/userRoute.js";
import dotenv from "dotenv";
dotenv.config({ override: true, debug: true });


import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// Required to simulate __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Middleware FIRST
app.use(cors());

// Serve images statically
app.use("/images", express.static(path.join(__dirname, "uploads")));


// Body parser
app.use(express.json());

// API routes
app.use("/api/food", foodRouter);
app.use("/api/user",userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order",orderRouter)

// Health check route
app.get("/", (req, res) => {
  res.send("API WORKING");
});

// DB connection and start server
connectDB();

app.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port}`);
});
