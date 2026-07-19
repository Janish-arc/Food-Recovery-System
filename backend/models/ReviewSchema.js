import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        default: null
    },

    reviewType: {
      type: String,
      enum: ["restaurant", "food", "order"],
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },{timestamps: true,});

export const Review = mongoose.model("Review", ReviewSchema);