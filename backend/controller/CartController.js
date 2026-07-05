import { Cart } from "../models/CartSchema.js"
import { Food } from "../models/FoodSchema.js"


//Create Cart
export const CreateCart = async(req, res) => {
    try {
        const {menuItem, quantity} = req.body
        if(!menuItem || !quantity){
            return res.status(404).json({success: false, message: "MenuItem and quantity are required"})
        }
        const food = await Food.findById(menuItem)
        if(!food){
            return res.status(404).json({success: false, message: "MenuItem not Available"})
        }
        let cart = await Cart.findOne({user: req.user._id})
        if(!cart){
            cart = await Cart.create({user: req.user._id, items: []})
        }
        const itemIndex = cart.items.findIndex(item => item.menuItem.toString() === menuItem)
        if(itemIndex > -1){
            cart.items[itemIndex].quantity += Number(quantity)
        }else{
            cart.items.push({menuItem, quantity, price: food.price})
        }
        cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity,0);
        let discount = 0;
        if (cart.subtotal >= 1000) discount = cart.subtotal * 0.15;
        else if (cart.subtotal >= 500) discount = cart.subtotal * 0.10;
        else if (cart.subtotal >= 250) discount = cart.subtotal * 0.05;
        cart.deliveryFee = cart.subtotal >= 500 ? 0 : 40;
        cart.tax = Number((cart.subtotal * 0.05).toFixed(2));
        cart.total = cart.subtotal + cart.deliveryFee + cart.tax - cart.discount;
        await cart.save();

        return res.status(200).json({success: true, message: "Item added to Cart", cart})
    } catch (error) {
         return res.status(404).json({success: false, message: error.message})
    }
}

//Get Cart
export const GetCart = async(req, res) => {
    try {
        const cart = await Cart.findOne({user: req.user._id}).populate("items.menuItem")
        if(!cart){
            return res.status(404).json("Cart is Empty")
        }
        return res.status(200).json({success: true, cart})
    } catch (error) {
        return res.status(404).json({success: false, message: error.message})
    }
}

//Update Cart
export const UpdateCart = async(req, res) => {
    try {
        const { quantity } = req.body
        const cart = await Cart.findOne({user: req.user._id}).populate("items.menuItem")
        if(!cart){
            return res.status(400).json({success: false, message: "Cart not found"})
        }
        const item = cart.items.find(item => item._id.toString() === req.params.id);
        if(!item){
            return res.status(404).json({success: false, message: "MenuItem not found"})
        }
        item.quantity = Number(quantity);
        cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity,0);
        console.log("subtotal", cart.subtotal)
        cart.discount = 0;
        if (cart.subtotal >= 1000) cart.discount = cart.subtotal * 0.15;
        else if (cart.subtotal >= 500) cart.discount = cart.subtotal * 0.10;
        else if (cart.subtotal >= 250) cart.discount = cart.subtotal * 0.05;
        console.log("subtotal", cart.discount)
        cart.deliveryFee = cart.subtotal >= 500 ? 0 : 40;
        cart.tax = Number((cart.subtotal * 0.05).toFixed(2));
        cart.total = cart.subtotal + cart.deliveryFee + cart.tax - cart.discount;
        await cart.save();
        return res.status(200).json({success: true, cart});
    } catch (error) {
        return res.status(404).json({success: false, message: error.message})
    }
}

//Delete Cart
export const RemoveCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({user: req.user._id,});
    if (!cart) {
      return res.status(404).json({success: false, message: "Cart not found."});
    }
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.id);
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity,0);
    cart.deliveryFee = cart.subtotal >= 500 ? 0 : 40;
    cart.tax = Number((cart.subtotal * 0.05).toFixed(2));
    cart.total = cart.subtotal + cart.deliveryFee + cart.tax;
    await cart.save();
    res.status(200).json({success: true, message: "Item removed.",cart});
  } catch (error) {
    res.status(500).json({success: false, message: error.message,});
  }
};

//Clear Cart
export const ClearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({user: req.user._id,});
    if (!cart) {
      return res.status(404).json({success: false, message: "Cart not found."});
    }
    cart.items = [];
    cart.subtotal = 0;
    cart.deliveryFee = 0;
    cart.tax = 0;
    cart.total = 0;
    await cart.save();
    res.status(200).json({success: true, message: "Cart cleared successfully."});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
};