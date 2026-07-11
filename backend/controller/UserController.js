import handleError from "../helper/handleError.js"
import { sendToken } from "../helper/jwt.js"
import { User } from "../models/UserSchema.js"
import {v2 as cloudinary} from "cloudinary"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Food } from "../models/FoodSchema.js";
import sendEmail from "../helper/sendEmail.js";
import crypto from "crypto";

//Register User

export const register = async (req, res, next) => {
   console.log("Body:", req.body);
    console.log("File:", req.file);
  try {
    const { name, email, password, phoneNo, address, state, country, pincode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill out all the fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    let imageData = {};

    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64"
      )}`;

      const myCloud = await cloudinary.uploader.upload(base64, {
        folder: "ECOM_AVATAR",
        width: 150,
        crop: "scale",
      });

      imageData = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    const user = await User.create({
      name,
      email,
      password,
      phoneNo,
      image: imageData,
      address, 
      state,
      country,
      pincode
    });

    sendToken(user, 201, res);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//User Login
export const LoginUser = async(req, res, next) => {
    try{
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({success: false, message: "Please fill out all the fields"})
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({success: false, message: "Invalid Email or Password"})
        }
        const isMatched = await user.comparePassword(password);
        if(!isMatched){
            return res.status(400).json({success: false, message: "Invalid Email or Password" });
        }
        sendToken(user, 201, res)
    }catch(error){
        return res.status(400).json({success: false, message: error.message})
    }
}

//LogOut User
export const LogoutUser = async(req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()), httpOnly: true, secure: true, sameSite: "None"
    })
    return res.status(200).json({success: true, message: "Logged out successfully"})
}

//Get My Profile
export const MyProfile = async(req, res, next) => {
    const user = await User.findById(req.user.id)
    return res.status(200).json({success: true, user})
}

//Update Profile
export const UpdateProfile = async (req, res, next) => {
  const { name, email, phoneNo, state, address, country, pincode  } = req.body;
  const updatedUserProfile = {
    name, email, phoneNo, state, address, country, pincode
  };
  const user = await User.findById(req.user.id);
  if (req.file) {
    if (user.image?.public_id) {
      await cloudinary.uploader.destroy(user.image.public_id);
    }
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;
    const myCloud = await cloudinary.uploader.upload(base64, {
      folder: "ECOM_AVATAR",
      width: 150,
      crop: "scale",
    });
    updatedUserProfile.image = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  const updatedProfile = await User.findByIdAndUpdate(
    req.user.id,
    updatedUserProfile,
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json({
    success: true,
    updatedProfile,
  });
};


//Get All Users (Admin)
export const GetAllUsers = async(req, res, next) => {
    const user = await User.find()
    return res.status(200).json({success: true, user})
}

//Get Single User (Admin)
export const GetSingleUser = async(req, res, next) => {
    const user = await User.findById(req.params.id)
    if(!user){
        return res.status(400).json({success: false, message: "User not available"})
    }
    return res.status(200).json({success: true, user})
}

//Delete User
export const DeleteUser = async(req, res, next) => {
    const user = await User.findById(req.params.id)
    if(!user){
        return next(new handleError("User not found", 404))
    }
    await User.findByIdAndDelete(req.params.id)
    return res.status(200).json({success: true, message:" User deleted successfully"})

}

//Forgot Password
export const ForgotPassword = async (req, res, next) => {
    const {email} = req.body
    const user = await User.findOne({email})
    if(!user){
        return next(new handleError("User is not found", 404))
    }
    
    let resetToken;
    try{
        resetToken = user.resetUserPassword()
        await user.save({validateBeforeSave: false})
    }catch(err){
        return next(new handleError("Cannot generate rest token, please try again later", 404))
    }
    // const resetPasswordUrl = `${req.protocol}://${req.host}/reset/${resetToken}`
    const resetPasswordUrl = `http://localhost:5173/reset/password/${resetToken}`
    const message = `Please click on the below link to reset your password \n${resetPasswordUrl} \nThis link will expire in 30 minutes \nIf this is not you please ignore this message`
   const messageHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 500px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333333;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>
            You requested to reset your password. Click the button below to continue:
            </p>
            <div style="text-align: center; margin: 20px 0;">
            <a href="${resetPasswordUrl}"
                style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Reset Password
            </a>
            </div>
            <p>
            Or copy and paste this link into your browser:
            </p>
            <p style="word-break: break-all; color: #007bff;">
            ${resetPasswordUrl}
            </p>
            <p style="color: red; font-weight: bold;">
            This link will expire in 30 minutes.
            </p>
            <p>
            If you did not request a password reset, please ignore this email.
            </p>
            <br>
            <p>
            Regards,<br>
            Your Website Team
            </p>
        </div>
        </div>
        `;
    try {
        await sendEmail({email: user.email, subject: "Reset your password", message, html:messageHtml})
        res.status(200).json({message: `Request has been sent to ${user.email} email`})
    } catch (error) {
        user.resetPasswordToken = undefined,
        user.resetPasswordExpiry = undefined,
        await user.save({validateBeforeSave: false})
        return next(new handleError("Link cannot be send to your email, please try again later..", 404))
    }
}

//Reset Password
export const ResetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user = await User.findOne({
        resetPasswordToken, resetPasswordExpiry: {$gt: Date.now()}
    })
    if(!user){
        return next(new handleError("Invalid user or user code has been expired", 404))
    }
    const {password, confirmPassword} = req.body
    if(password !== confirmPassword){
        return next(new handleError("Password doesn't match please check both the password", 404))
    }
    user.password = password,
    user.resetPasswordToken = undefined
    user.resetPasswordExpiry = undefined
    await user.save()
    sendToken(user, 201, res)
}