import { User } from "../models/UserSchema.js"
import jwt from 'jsonwebtoken'
import handleError from "./handleError.js"

export const isAuthenticated = async(req, res, next) => {
    try {
        //  console.log("Cookies:", req.cookies);
        const {token} = req.cookies
        //  console.log("Token:", token);
        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decodedData.id)
        next()
    } catch (error) {
        return res.status(400).json({success: false, message: "Please Login to access"})
    }
}

export const roleBasedAccess = (...roles) => {
    return (req, res, next) => {
        if(!req.user){
            return next(new handleError("Please Login to access", 404))
        }
        if(!roles.includes(req.user.role)){
            return next(new handleError(`Role - ${req.user.role} is not available`))
        }
        next()
    }
}