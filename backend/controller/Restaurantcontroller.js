import { Restaurant } from "../models/RestaurantSchema .js";
import { User } from "../models/UserSchema.js";
import {v2 as cloudinary} from "cloudinary"

export const CreateRestaurant = async (req, res) => {
  try {
    const { name, description, email, phone, address, city, state, pincode, location, openingTime, closingTime, deliveryFee, minimumOrder, deliveryTime,} = req.body;
    if (
      !name || !description || !email || !phone || !address || !city || !state || !pincode || !location || !openingTime || !closingTime || !deliveryFee || !minimumOrder || !deliveryTime){
      return res.status(400).json({success: false, message: "Please fill all the fields."});
    }
    const alreadyExists = await Restaurant.findOne({owner: req.user._id,});
    if (alreadyExists) {
      return res.status(400).json({success: false, message: "You already own a restaurant.",});
    }
    if (!req.file) {
      return res.status(400).json({success: false, message: "Restaurant logo is required."});
    }
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const myCloud = await cloudinary.uploader.upload(base64, {
      folder: "RESTAURANT_LOGOS",
      width: 300,
      crop: "scale",
    });
    const restaurant = await Restaurant.create({
      owner: req.user._id, name, description,
      logo: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      email, phone, address, city, state, pincode, location, openingTime, closingTime, deliveryFee, minimumOrder, deliveryTime,
      rating: 0, totalReviews: 0, isOpen: true,
    });
    await User.findByIdAndUpdate(req.user._id, { role: "restaurant"});
    res.status(201).json({success: true, message: "Restaurant created successfully.", restaurant});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

//Get My Restaurant 
export const GetMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({owner: req.user._id,});
    if (!restaurant) {
      return res.status(404).json({success: false, message: "Restaurant not found."});
    }
    res.status(200).json({success: true, restaurant,});
  } catch (error) {
    res.status(500).json({success: false, message: error.message,});
  }
};

//Update Restaurant
export const UpdateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({success: false, message: "Restaurant not found.",});
    }
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({success: false, message: "You are not authorized to update this restaurant."});
    }
    if (req.file) {
      if (restaurant.logo.public_id) {
        await cloudinary.uploader.destroy(restaurant.logo.public_id);
      }
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const myCloud = await cloudinary.uploader.upload(base64, {
        folder: "RESTAURANT_LOGOS",
        width: 300,
        crop: "scale",
      });
      req.body.logo = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body,{new: true, runValidators: true});
    res.status(200).json({success: true, message: "Restaurant updated successfully.", restaurant: updatedRestaurant});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};

//Delete Restaurant
export const DeleteRestaurant = async(req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id)
        if(!restaurant){
            return res.status(404).json({success: false, message: "Restaurant is not found"}) 
        }
        if (restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({success: false, message: "You are not authorized to delete this restaurant.",});
        }
        if (restaurant.logo.public_id) {
        await cloudinary.uploader.destroy(restaurant.logo.public_id);
        }
        await Restaurant.findByIdAndDelete(req.params.id);
        await User.findByIdAndUpdate(req.user._id, {role: "customer",});
        res.status(200).json({success: true, message: "Restaurant deleted successfully."});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

//Get All Restaurants
export const GetRestaurants = async(req, res) => {
    try {
        const restaurants = await Restaurant.find().populate("owner")
        res.status(200).json({success: true, restaurants, count: restaurants.length,})
    } catch (error) {
        res.status(404).json({success: false, message: "No Restaurant Available"})
    }
}

//Get Single Restaurant
export const GetRestaurant = async(req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).populate("owner")
        if(!restaurant){
            return res.status(404).json({success: false, message: "Restaurant not found"})
        }
        res.status(200).json({success: true, restaurant})
    } catch (error) {
        res.status(404).json({success: false, message: error.message})
    }
}