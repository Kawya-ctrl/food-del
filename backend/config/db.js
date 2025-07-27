
import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://kawya8688:kawya200751@cluster0.av2a3sb.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}

