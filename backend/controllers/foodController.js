import foodModel from "../models/foodModel.js";
import fs from "fs";

// Add food item
const addFood = async (req, res) => {

    console.log("🔔 POST /api/food/add hit");
     console.log("📝 req.body:", req.body);
  console.log("🖼️ req.file:", req.file);

  const image_filename = req.file?.filename;

if (!image_filename) {
    return res.status(400).json({ success: false, message: "Image file missing!" });
  }


  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.error("Error saving food:", error);
    res .json({ success: false, message: "Error saving food" });
  }
};

// all food list
const listFood = async(req,res) =>{
    try{
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
};

//remove food item
const removeFood = async (req,res) => {
    try{
        const food= await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
};





export { addFood, listFood, removeFood};






