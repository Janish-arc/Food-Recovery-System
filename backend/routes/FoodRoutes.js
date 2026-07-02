import express from "express"
import { isAuthenticated, roleBasedAccess } from "../helper/UserAuth.js"
import {CreateMenuItem, DeleteMenuItem, GetMyMenu, GetRestaurantMenu, GetSingleMenuItem, UpdateMenuItem} from "../controller/FoodController.js"
import multer from "multer";

const food = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });

food.route("/menu/create").post(upload.single("image"),isAuthenticated, roleBasedAccess("restaurant"), CreateMenuItem)
food.route("/menu/get").get(isAuthenticated, GetMyMenu)
food.route("/menu/update/:id").put(upload.single("image"), isAuthenticated, roleBasedAccess("restaurant"), UpdateMenuItem)
food.route("/menu/delete/:id").delete(isAuthenticated, roleBasedAccess("restaurant"), DeleteMenuItem)
food.route("/menu/restaurant/:restaurantId").get(isAuthenticated, GetRestaurantMenu)
food.route("/menu/:id").get(isAuthenticated, GetSingleMenuItem)

export default food