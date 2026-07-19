import { Restaurant } from "../models/RestaurantSchema .js";
import { Order } from "../models/OrderSchema.js"
import { Review } from "../models/ReviewSchema.js"

// CreateRestaurantReview
export const CreateRestaurantReview = async(req, res) => {
    try{
        const {restaurant, order, rating, comment} = req.body
        const restaurantExists = await Restaurant.findById(restaurant)
        if(!restaurantExists){
            return res.status(404).json({success: false, message: "Restaurant not found"})
        }
        const orderExists = await Order.findById(order)
        if(!orderExists){
            return res.status(404).json({success: false, message: "Order not found"})
        }
        if (orderExists.restaurant.toString() !== restaurant.toString()) {
            return res.status(400).json({success: false,message: "This order does not belong to this restaurant"});
        }
        if (orderExists.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({success: false, message: "UnAuthorised User"});
        }
        if (orderExists.orderStatus !== "Delivered") {
            return res.status(400).json({success: false, message: "You can review only delivered orders"})
        }
        const alreadyReviewed = await Review.findOne({user: req.user._id, restaurant, order, reviewType: "restaurant"});
        if (alreadyReviewed) {
            return res.status(400).json({success: false, message: "You have already reviewed this restaurant for this order"})
        }
        const review = await Review.create({user: req.user._id, restaurant, order, reviewType: "restaurant", rating, comment});
        const reviews = await Review.find({restaurant, reviewType: "restaurant"});
        const totalReviews = reviews.length;
        const averageRating = (reviews.reduce((sum, item) => sum + item.rating, 0) / totalReviews).toFixed(1);
        await Restaurant.findByIdAndUpdate(restaurant, {rating: averageRating || 0, totalReviews});
        return res.status(201).json({success: true, message: "Restaurant review added successfully", review});
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}
// GetRestaurantReviews()

// =============================
// Food
// =============================

// CreateFoodReview()
// GetFoodReviews()

// =============================
// Order
// =============================

// CreateOrderReview()
// GetOrderReviews()

// =============================
// Common
// =============================

// GetMyReviews()
export const GetMyReviewCount = async (req, res) => {
    try {
        const reviewCount = await Review.countDocuments({user: req.user._id});
        return res.status(200).json({success: true, reviewCount});
    } catch (error) {
        return res.status(500).json({success: false,message: error.message
        });
    }
};

// GetSingleReview()
// UpdateReview()
// DeleteReview()