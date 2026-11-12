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
},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

CategorySchema.virtual("foods", {
    ref: "Food",
    localField: "_id",
    foreignField: "category"
});

export const Category = mongoose.model("Category", CategorySchema)