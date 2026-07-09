import express from "express"
import { isAuthenticated, roleBasedAccess } from "../helper/UserAuth.js"
import {CreateMenuItem, DeleteMenuItem, GetAllMenuItems, GetMenuItemsOfRestaurant, GetMyMenu, GetRestaurantMenu, GetSingleMenuItem, MenuByCategory, ToggleFoodAvailability, UpdateMenuItem} from "../controller/FoodController.js"
import multer from "multer";

const food = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });

food.route("/menu/create").post(upload.single("image"),isAuthenticated, roleBasedAccess("restaurant"), CreateMenuItem)
food.route("/menu/get").get(isAuthenticated, roleBasedAccess("restaurant"), GetMyMenu)
food.route("/menu/update/:id").put(upload.single("image"), isAuthenticated, roleBasedAccess("restaurant"), UpdateMenuItem)
food.route("/menu/delete/:id").delete(isAuthenticated, roleBasedAccess("restaurant"), DeleteMenuItem)
food.route("/menu/get/allmenu").get(GetAllMenuItems)
food.route("/menu/restaurant/foods").get(isAuthenticated, roleBasedAccess("restaurant"), GetMenuItemsOfRestaurant)
food.route("/menu/restaurant/:restaurantId").get(isAuthenticated, GetRestaurantMenu)
food.route("/menu/:id").get(isAuthenticated, GetSingleMenuItem)
food.route("/menu/category/get/:id").get(isAuthenticated, roleBasedAccess("customer"), MenuByCategory)
food.route("/menu/toggle/availablity/:id").put(isAuthenticated, roleBasedAccess("restaurant"), ToggleFoodAvailability)
export default food