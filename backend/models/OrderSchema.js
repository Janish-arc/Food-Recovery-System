import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    items: [{
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        image: {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
    }],
    subtotal: {
            type: Number,
            required: true
        },
    deliveryFee: {
            type: Number,
            required: true,
            default: 0
        },
    tax: {
            type: Number,
            required: true,
            default: 0
        },
    discount: {
            type: Number,
            required: true,
            default: 0
        },
    totalAmount: {
            type: Number,
            required: true
        },
    deliveryAddress: {
            type: String,
            required: true
        },
    paymentMethod: {
            type: String,
            enum: ["Cash on Delivery", "UPI", "Credit Card", "Debit Card", "Net Banking"],
            required: true,
        },
    paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            required: true
        },
    orderStatus: {
            type: String,
            enum: ["Placed", "Accepted", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
            default: "Placed",
            required: true
        },
    estimatedDelivery: {
            type: Number,
            default: 30,
            required: true
        },
}, {timestamps: true})

export const Order = mongoose.model("Order", OrderSchema)