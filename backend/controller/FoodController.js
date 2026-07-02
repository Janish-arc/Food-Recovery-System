import { Food } from "../models/FoodSchema.js";
import { Restaurant } from "../models/RestaurantSchema .js";
import { Category } from "../models/CategorySchema.js";
import {v2 as cloudinary} from 'cloudinary'


//Create Menu Item
export const CreateMenuItem = async (req, res) => {
  try {
    const {name, category, description, price, preparedTime} = req.body;
    if (!name || !category || !price || !preparedTime) {
      return res.status(400).json({success: false, message: "Please fill all required fields."});
    }
    const restaurant = await Restaurant.findOne({owner: req.user._id});
    if (!restaurant) {
      return res.status(404).json({success: false, message: "Restaurant not found."
      });
    }
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({success: false, message: "Category not found."
      });
    }
    if (!req.file) {
      return res.status(400).json({success: false, message: "Food image is required."
      });
    }
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const myCloud = await cloudinary.uploader.upload(base64,{
      folder:"MENU_ITEMS",
      width:500,
      crop:"scale"
    });
    const food = await Food.create({restaurant: restaurant._id, name, category, description, price,
      image:{
        public_id: myCloud.public_id,
        url: myCloud.secure_url
      },preparedTime
    });
    res.status(201).json({success:true, message:"Menu item added successfully.", food
    });
  } catch (error) {
    res.status(500).json({success:false, message:error.message});
  }
};

//Get My Menu Item
export const GetMyMenu = async(req,res)=>{
    try{
        const restaurant = await Restaurant.findOne({owner:req.user._id});
        if(!restaurant){
            return res.status(404).json({success:false, message:"Restaurant not found."});
        }
        const foods = await Food.find({restaurant:restaurant._id}).populate("category");
        res.status(200).json({success:true, foods});
    }catch(error){
        res.status(500).json({success:false, message:error.message});
    }
}

//Update Menu Item
export const UpdateMenuItem = async(req,res)=>{
    try{
        let food = await Food.findById(req.params.id);
        if(!food){
            return res.status(404).json({success:false, message:"Menu item not found."});
        }
        const restaurant = await Restaurant.findOne({owner:req.user._id});
        if(food.restaurant.toString() !== restaurant._id.toString()){
            return res.status(403).json({success:false, message:"Unauthorized."});
        }
        if(req.file){
            await cloudinary.uploader.destroy(food.image.public_id);
            const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
            const myCloud = await cloudinary.uploader.upload(base64,{folder:"MENU_ITEMS"});
            req.body.image={
                public_id:myCloud.public_id,
                url:myCloud.secure_url
            };
        }
        food = await Food.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true});
        res.status(200).json({success:true, food});
    }catch(error){
        res.status(500).json({success:false, message:error.message});
    }
}

//Delete Menu Item
export const DeleteMenuItem = async(req,res)=>{
    try{
        const food = await Food.findById(req.params.id);
        if(!food){
            return res.status(404).json({success:false, message:"Menu item not found."});
        }
        const restaurant = await Restaurant.findOne({owner:req.user._id});
        if(food.restaurant.toString() !== restaurant._id.toString()){
            return res.status(403).json({success:false, message:"Unauthorized."});
        }
        await cloudinary.uploader.destroy(food.image.public_id);
        await Food.findByIdAndDelete(req.params.id);
        res.status(200).json({success:true, message:"Menu item deleted successfully."});
    }catch(error){
        res.status(500).json({success:false, message:error.message});
    }
}


//Get Restaurant Menu
export const GetRestaurantMenu = async(req,res)=>{
    try{
        const foods = await Food.find({restaurant:req.params.restaurantId}).populate("category");
        res.status(200).json({success:true, foods});
    }catch(error){
        res.status(500).json({success:false, message:error.message});
    }
}



//Get Single MenuItem
export const GetSingleMenuItem = async(req,res)=>{
    try{
        const food = await Food.findById(req.params.id).populate("restaurant").populate("category");
        if(!food){
            return res.status(404).json({success:false, message:"Menu item not found."});
        }
        res.status(200).json({success:true, food});
    }catch(error){
        res.status(500).json({success:false, message:error.message});
    }
}