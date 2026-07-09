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
    const logoFile = req.files?.logo?.[0];
    const bannerFile = req.files?.banner?.[0];
    if (!logoFile || !bannerFile) {
      return res.status(400).json({success: false, message: "Restaurant logo and banner is required."});
    }
    const logoBase64 = `data:${logoFile.mimetype};base64,${logoFile.buffer.toString("base64")}`;
    const bannerBase64 = `data:${bannerFile.mimetype};base64,${bannerFile.buffer.toString("base64")}`;

    const logoCloud = await cloudinary.uploader.upload(logoBase64, {
        folder: "RESTAURANT_LOGOS"
    });

    const bannerCloud = await cloudinary.uploader.upload(bannerBase64, {
        folder: "RESTAURANT_BANNERS"
    });
    const restaurant = await Restaurant.create({
      owner: req.user._id, name, description,
      logo: {
          public_id: logoCloud.public_id,
          url: logoCloud.secure_url,
      },
      banner: {
          public_id: bannerCloud.public_id,
          url: bannerCloud.secure_url,
      },
      email, phone, address, city, state, pincode, location, openingTime, closingTime, deliveryFee, minimumOrder, deliveryTime,
      rating: 0, totalReviews: 0, isOpen: true,
    });
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { role: "restaurant" },{ new: true });
    return res.status(201).json({success: true, message: "Restaurant created successfully.", restaurant});
  } catch (error) {
    return res.status(500).json({success: false, message: error.message});
  }
};

//Get My Restaurant 
export const GetMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({owner: req.user._id,});
    if (!restaurant) {
      return res.status(404).json({success: false, message: "Restaurant not found."});
    }
    return res.status(200).json({success: true, restaurant,});
  } catch (error) {
    return res.status(500).json({success: false, message: error.message,});
  }
};

//Update Restaurant
export const UpdateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({success: false, message: "Restaurant not found."});
    }
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({success: false, message: "You are not authorized to update this restaurant.",});
    }

    const logoFile = req.files?.logo?.[0];
    if (logoFile) {
      if (restaurant.logo?.public_id) {
        await cloudinary.uploader.destroy(restaurant.logo.public_id);
      }
      const logoBase64 = `data:${logoFile.mimetype};base64,${logoFile.buffer.toString("base64")}`;
      const logoCloud = await cloudinary.uploader.upload(logoBase64, {
        folder: "RESTAURANT_LOGOS",
        width: 300,
        crop: "scale",
      });
      req.body.logo = {public_id: logoCloud.public_id, url: logoCloud.secure_url,};
    }

    const bannerFile = req.files?.banner?.[0];
    if (bannerFile) {
      if (restaurant.banner?.public_id) {
        await cloudinary.uploader.destroy(restaurant.banner.public_id);
      }
      const bannerBase64 = `data:${bannerFile.mimetype};base64,${bannerFile.buffer.toString("base64")}`;
      const bannerCloud = await cloudinary.uploader.upload(bannerBase64, {
        folder: "RESTAURANT_BANNERS",
        width: 1200,
        crop: "scale",
      });
      req.body.banner = {public_id: bannerCloud.public_id, url: bannerCloud.secure_url,};
    }
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body,{new: true, runValidators: true,});
    return res.status(200).json({success: true, message: "Restaurant updated successfully.", restaurant: updatedRestaurant});
  } catch (error) {
    return res.status(500).json({success: false, message: error.message,});
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
        return res.status(200).json({success: true, message: "Restaurant deleted successfully."});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
};

//Get All Restaurants
export const GetRestaurants = async(req, res) => {
    try {
        const restaurants = await Restaurant.find().populate("owner").populate({path: "foods", model: "Food"})
        return res.status(200).json({success: true, restaurants, count: restaurants.length,})
        const restaurant = await Restaurant.find().select("_id name");
        const foods = await Food.find().select("name restaurant");
    } catch (error) {
        return res.status(404).json({success: false, message: "No Restaurant Available"})
    }
}

//Get Single Restaurant
export const GetRestaurant = async(req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).populate("owner").populate({path: "foods", model: "Food"})
        if(!restaurant){
            return res.status(404).json({success: false, message: "Restaurant not found"})
        }
        return res.status(200).json({success: true, restaurant})
    } catch (error) {
        return res.status(404).json({success: false, message: error.message})
    }
}