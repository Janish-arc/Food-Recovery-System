import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
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
    description: {
        type: String,
        required: true
    }
},{timestamps: true})

export const Category = mongoose.model("Category", CategorySchema)