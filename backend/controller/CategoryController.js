import { Category } from "../models/CategorySchema.js"
import {v2 as cloudinary} from "cloudinary"


//Create Category
export const CreateCategory = async(req, res) => {
    try {
        const {name, description} = req.body
        if(!name || !description){
           return res.status(404).json({success: false, message: "Please fill in all the details"})
        }
        const alreadyExists = await Category.findOne({name: req.body.name})
        if(alreadyExists){
           return res.status(409).json({success: false, message: "Category already Exists"})
        }
        if (!req.file) {
            return res.status(400).json({success: false, message: "Category image is required"});
        }
        const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        const myCloud = await cloudinary.uploader.upload(base64, {
            folder: "CATEGORY_IMAGE",
            width: 300,
            crop: "scale",  
        });
        const category = await Category.create({
            name, description,
            image: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
        })
        return res.status(200).json({success: true, category})
    } catch (error) {
        res.status(404).json({success: false, message: error.message})
    }
}

//Get Category
export const GetCategory = async(req, res) => {
    try {
        const category = await Category.find()
        return res.status(200).json({success: true, category})
    } catch (error) {
        return res.status(404).json({success: false, message: error.message})
    }
}

//Update Category
export const UpdateCategory = async(req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        if(!category){
            return res.status(404).json({success: false, message: "Category is not available"})
        }
        if (req.file) {
            if (category.image && category.image.public_id) {
                await cloudinary.uploader.destroy(category.image.public_id);
            }
            const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
            const myCloud = await cloudinary.uploader.upload(base64, {
                folder: "CATEGORY_IMAGE",
                width: 300,
                crop: "scale",
            });
            req.body.image = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body,{new: true, runValidators: true})
        return res.status(200).json({success: true, category: updatedCategory})
    } catch (error) {
        return res.status(404).json({success: false, message: error.message})
    }
}

//Delete Category
export const DeleteCategory = async(req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        if(!category){
            return res.status(404).json({success: false, message: "Category not found"})
        }
        if(category.image && category.image.public_id){
            await cloudinary.uploader.destroy(category.image.public_id)
        }
        await Category.findByIdAndDelete(req.params.id)
        return res.status(200).json({success: true, message: "Category deleted successfully"})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}