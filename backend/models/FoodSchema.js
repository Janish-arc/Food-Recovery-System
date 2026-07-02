import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    description: {
        type: String
    },
    price:{
        type: Number,
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
    isAvailable: {
        type: Boolean,
        default: true
    },
    preparedTime:{
        type: Number,
        required: true
    },
    rating:{
        type: Number,
        default: 0
    },
    totalReviews:{
        type: Number,
        default: 0
    },
},{timestamps: true})

export const Food = mongoose.model("Food", FoodSchema)