import { Order } from "../models/OrderSchema.js"
import { Cart } from "../models/CartSchema.js"
import { Restaurant } from "../models/RestaurantSchema .js"

//Create Order
export const CreateOrder = async(req, res) => {
    try {
        const {paymentMethod, deliveryAddress} = req.body
        if(!paymentMethod){
            return res.status(400).json({success: false, message: "Payment method is required"})
        }
        const cart = await Cart.findOne({user: req.user._id}).populate("items.menuItem");
        if(!cart || cart.items.length === 0){
            return res.status(404).json({success: false, message: "Cart is Empty"})
        }
        const orderItems = cart.items.map((item) => ({
            menuItem: item.menuItem,
            name: item?.menuItem?.name, 
            quantity: item.quantity, 
            image: item?.menuItem?.image,
            price: item.price
        }))
        const order = await Order.create({
            user: req.user._id,
            restaurant: cart?.items[0]?.menuItem?.restaurant,
            items: orderItems,
            subtotal: cart.subtotal,
            deliveryFee: cart.deliveryFee,
            tax: cart.tax,
            discount: cart.discount,
            totalAmount: cart.total,
            paymentMethod, 
            deliveryAddress, orderStatus: "Placed", paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid"
        })
        cart.items = [];
        cart.subtotal = 0;
        cart.discount = 0;
        cart.deliveryFee = 0;
        cart.tax = 0;
        cart.total = 0;
        await cart.save();
        return res.status(201).json({success: true, message: "Order Placed Successfully", order})
    } catch (error) {
        return res.status(404).json({success: false, message: error.message})
    }
}

//Get Orders
export const GetMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("restaurant");
        return res.status(200).json({success: true, orders,});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message,});
    }
};

//Get Single Order
export const GetSingleOrder = async(req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("restaurant").populate("user")
        if(!order){
            return res.status(404).json({success: false, message: "Order not found"})
        }
        if(order.user?._id.toString() !== req.user._id.toString()){
            return res.status(400).json({success: false, message: "Not authorized"})
        }
        return res.status(200).json({success: true, order})
    } catch (error) {
        return res.status(404).json({success: false, message: error.message})
    }
}

//Cancel Order
export const CancelOrder = async(req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        if(!order){
            return res.status(400).json({success: false, message:"Order does not exist"})
        }
        if(order.user?.toString() !== req.user._id.toString()){
            return res.status(400).json({success: false, message: "UnAuthorized"})
        }
        if(order?.orderStatus !== "Placed"){
            return res.status(400).json({success: false, message:"Order cannot be cancelled"})
        }
        order.orderStatus = "Cancelled"
        await order.save()
        return res.status(200).json({success: true, message: "Order cancelled successfully", order})
    } catch (error) {
        return res.status(404).json({success: false, message: error?.message})
    }
}

//Get Restaurant Orders
export const GetRestaurantOrders = async(req, res) => {
    try {
        const restaurant = await Restaurant.findOne({owner: req.user._id});
        const order = await Order.find({restaurant: restaurant._id}).populate("user")
        if (order.length === 0) {
            return res.status(404).json({success: false, message: "No orders found."});
        }
        return res.status(200).json({success: true, order})
    } catch (error) {
        return res.status(404).json({success: false, message: error?.message})
    }
}

//Get Orders by Admin
export const GetOrdersByAdmin = async(req, res) => {
    try {
        const order = await Order.find().populate("restaurant").populate("user")
        return res.status(200).json({success: true, order})
    } catch (error) {
        return res.status(404).json({success: false, message: error.message})
    }
}