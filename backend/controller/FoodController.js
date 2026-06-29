import { Food } from "../models/FoodSchema.js"
import {v2 as cloudinary} from "cloudinary"


//Publish Food
export const PublishFood = async (req, res, next) => {
    const {
        name,
        category,
        quantity,
        description,
        expiryDate,
        pickUpAddress,
        organization
    } = req.body;
    const donorId = req.user._id;
    try {
        let imageData = {};
        if (req.file) {
            const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
            try {
                const myCloud = await cloudinary.uploader.upload(base64, {
                    folder: "ECOM_AVATAR",
                    quality: "auto",
                    fetch_format: "auto",
                    width: 1200,
                    crop: "scale",
                });
                imageData = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message,
                });
            }
        }
        const food = await Food.create({
            name,
            category,
            quantity,
            description,
            expiryDate,
            pickUpAddress,
            donorId,
            organization,
            image: imageData,
        });

        res.status(201).json({
            success: true,
            food,
        });

    } catch (error) {
        console.error("Outer Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//Get All Available Foods
export const GetFoods = async(req, res, next) => {
    const foods = await Food.find() .populate("donorId").populate("volunteerId").populate("ngoId").sort({ createdAt: -1 });
    return res.status(200).json({success: true, foods})
}

//Get Single Foods
export const GetSingleFood = async(req, res, next) => {
    const food = await Food.findById(req.params.id).populate("donorId", "name phoneNo email");
    if(!food){
        return res.status(400).json({success: false, message:"Food not Available"})
    }
    return res.status(200).json({success: true, food})
}

//Update Food status
export const UpdateFoodStatus = async(req, res, next) => {
    const foods = await Food.findByIdAndUpdate(req.params.id, {status: req.body.status}, {new: true})
    return res.status(200).json({success: true, foods})
}

//Delete Food
export const deleteFood = async(req, res, next) => {
    const food = await Food.findByIdAndDelete(req.params.id)
    if(!food){
        return res.status(400).json({success: false, message: "No Food is Available"})
    }
    return res.status(200).json({success: true, message: "Food Deleted"})
}

//Get Single donor foods
export const SingleDonorFood = async(req, res, next) => {
    const foods = await Food.find({donorId : req.user._id}).populate("volunteerId"). populate("ngoId")
    return res.status(200).json({success: true, foods})
}

//NGO Cancels Order
export const CancelOrder = async(req, res, next) => {
    const food = await Food.findByIdAndUpdate(req.params.id, {status: "Available", ngoId: null}, { new: true })
    return res.status(200).json({success: true, food})
}

//Get Assigned Deliveries
export const GetVolunteerDeliveries = async(req, res, next) => {
    const foods = await Food.findById({volunteerId: req.user.id})
    return res.status(200).json({success: true, foods})
}

//NGO Accepts Food
export const AcceptFood = async(req, res, next) => {
  const food = await Food.findById(req.params.id)
  food.status = "Accepted"
  food.ngoId = req.user._id
  await food.save();
  return res.status(200).json({success: true, food})
}

//Get Single Ngo's Accepted Foods
export const GetSingleNgoAcceptedFoods = async(req, res, next) => {
    // console.log("Controller hit");
    try{
        const food = await Food.find({ngoId: req.user._id, status: { $ne: "Available" }}).populate("donorId").populate("volunteerId");
    return res.status(200).json({success: true, food})
    }catch(error){
        console.log(error)
    }
}

//Get Accepted Foods
export const GetAcceptedFoods = async(req, res, next) => {
    const foods = await Food.find({status: "Accepted", volunteerId: null}).populate("donorId").populate("ngoId");
    return res.status(200).json({success: true, foods})
}

//Takes Delivery
export const TakeDelivery = async(req, res) => {
    const food = await Food.findById(req.params.id)
    food.volunteerId = req.user._id;
    food.status = "Assigned";
    await food.save();
    return res.status(200).json({success: true, food})
}

//Volunteer My Deliveries 
export const MyDelieveries = async(req, res, next) => {
    const food = await Food.find({volunteerId: req.user._id}).populate("donorId").populate("ngoId")
    return res.status(200).json({success: true, food})
}

//Volunteer Mark Order Picked Up
export const MarkPickedUp = async(req, res, next) => {
    const food = await Food.findById(req.params.id)
    food.status = "Out for Delivery"
    await food.save();
    return res.status(200).json({success: true, food})
}

//Mark Delivered
export const Delivered = async(req, res, next) => {
    const food = await Food.findById(req.params.id)
    food.status = "Delivered"
    food.deliveredDate = Date.now()
    await food.save();
    return res.status(200).json({success: true, food})
}