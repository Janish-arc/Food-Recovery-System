import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    subtotal: {
            type: Number,
            default: 0
        },
    deliveryFee: {
            type: Number,
            default: 0
        },
    discount: {
        type: Number,
        default: 0
        },
    tax: {
            type: Number,
            default: 0
        },
    total: {
            type: Number,
            default: 0
        }
}, {timestamps: true})

export const Cart = mongoose.model("Cart", CartSchema)