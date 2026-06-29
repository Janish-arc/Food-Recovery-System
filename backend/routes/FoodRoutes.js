import express from "express"
import { AcceptFood, CancelOrder, deleteFood, Delivered, GetAcceptedFoods, GetFoods, GetSingleFood, GetSingleNgoAcceptedFoods, GetVolunteerDeliveries, MarkPickedUp, MyDelieveries, PublishFood, SingleDonorFood, TakeDelivery, UpdateFoodStatus } from "../controller/FoodController.js"
import { isAuthenticated, roleBasedAccess } from "../helper/UserAuth.js"
import multer from "multer";

const food = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });

food.route("/donorfood").post(isAuthenticated, roleBasedAccess("donor"), upload.single("image"), PublishFood)
food.route("/getallfoods").get(GetFoods)
food.route("/getsinglefood/:id").get(isAuthenticated, GetSingleFood)
food.route("/updatefood/:id").put(roleBasedAccess("donor"), UpdateFoodStatus)
food.route("/deletefood/:id").delete(isAuthenticated, roleBasedAccess("donor", "admin"), deleteFood)
food.route("/getsingledonorfood").get(isAuthenticated, roleBasedAccess("donor"), SingleDonorFood)
food.route("/cancelorder/:id").put(isAuthenticated, roleBasedAccess("ngo"), CancelOrder)
food.route("/status/delivered/:id").put(isAuthenticated, roleBasedAccess("volunteer"), Delivered)
food.route("/getvolunteerdeliveries").get(isAuthenticated, roleBasedAccess("volunteer"), GetVolunteerDeliveries)
food.route("/acceptsfood/:id").put(isAuthenticated, roleBasedAccess("ngo"), AcceptFood)
food.route("/getacceptedfood").get(isAuthenticated, roleBasedAccess("volunteer"), GetAcceptedFoods)
food.route("/status/assigned/:id").put(isAuthenticated, roleBasedAccess("volunteer"), TakeDelivery)
food.route("/mydeliveries").get(isAuthenticated, roleBasedAccess("volunteer"), MyDelieveries)
food.route("/status/picked/:id").put(isAuthenticated, roleBasedAccess("volunteer"), MarkPickedUp)
food.route("/getsingleNgofoods").get(isAuthenticated, roleBasedAccess("ngo"), GetSingleNgoAcceptedFoods)


export default food