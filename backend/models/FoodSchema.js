import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["Veg", "NonVeg", "Snacks"],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    expiryDate: {
        type: Date,
        required: true
    },
    deliveredDate: {
        type: Date,
        default: null
    },
    pickUpAddress: {
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
    status: {
        type: String,
        default: "Available",
        enum: ["Available", "Accepted", "Assigned", "Out for Delivery", "Delivered"]
    },
    organization:{
        type: String,
        required: true
    },
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    volunteerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    ngoId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true})

export const Food = mongoose.model("Food", FoodSchema)