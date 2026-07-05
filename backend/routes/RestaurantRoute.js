import express from 'express'
import multer from 'multer';
import { isAuthenticated, roleBasedAccess } from '../helper/UserAuth.js';
import { CreateRestaurant, DeleteRestaurant, GetMyRestaurant, GetRestaurant, GetRestaurants, UpdateRestaurant } from '../controller/Restaurantcontroller.js';

const restaurant = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });

restaurant.route("/restaurant/create").post(upload.fields([{ name: "logo", maxCount: 1 },{ name: "banner", maxCount: 1 }]), isAuthenticated, roleBasedAccess("customer"), CreateRestaurant)
restaurant.route("/restaurant/get/mine").get(isAuthenticated, roleBasedAccess("restaurant"), GetMyRestaurant)
restaurant.route("/restaurant/update/:id").put(upload.fields([{ name: "logo", maxCount: 1 },{ name: "banner", maxCount: 1 }]), isAuthenticated, roleBasedAccess("restaurant"), UpdateRestaurant)
restaurant.route("/restaurant/delete/:id").delete(isAuthenticated, roleBasedAccess("restaurant"), DeleteRestaurant)
restaurant.route("/restaurant/get/allrestaurant").get(GetRestaurants)
restaurant.route("/restaurant/get/:id").get(isAuthenticated, roleBasedAccess("customer"), GetRestaurant)

export default restaurant