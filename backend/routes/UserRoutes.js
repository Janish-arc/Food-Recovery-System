import express from "express"
import { DeleteUser, ForgotPassword, GetAllUsers, GetSingleUser, LoginUser, LogoutUser, MyProfile, register, ResetPassword, UpdateProfile } from "../controller/UserController.js"
import { isAuthenticated, roleBasedAccess } from "../helper/UserAuth.js"
import multer from 'multer'

const user = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });

user.route("/register").post(upload.single("image"), register)
user.route("/login").post(LoginUser)
user.route("/logout").post(isAuthenticated, LogoutUser)
user.route('/myprofile').get(isAuthenticated, MyProfile)
user.route("/updateprofile").put(upload.single("image"), isAuthenticated, UpdateProfile)
user.route("/getallusers").get(isAuthenticated, roleBasedAccess("admin"), GetAllUsers)
user.route('/getsingleuser/:id').get(isAuthenticated, roleBasedAccess("admin"), GetSingleUser)
user.route('/deleteuser/:id').delete(isAuthenticated, roleBasedAccess("admin"), DeleteUser)
user.route('/forgotpassword').post(ForgotPassword)
user.route('/password/reset/:token').put(ResetPassword);

export default user