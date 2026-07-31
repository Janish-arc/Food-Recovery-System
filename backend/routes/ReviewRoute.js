import express from 'express'
import { isAuthenticated, roleBasedAccess } from '../helper/UserAuth.js'
import {CreateFoodReview, CreateRestaurantReview, GetFoodReviews, GetMyReviewCount, GetRestaurantReviews} from '../controller/ReviewController.js'


const review = express.Router()

review.route("/restaurant/create").post(isAuthenticated, roleBasedAccess("customer"), CreateRestaurantReview)
review.route("/food/create").post(isAuthenticated, roleBasedAccess("customer"), CreateFoodReview )
review.route("/user/review").get(isAuthenticated, roleBasedAccess("customer"), GetMyReviewCount)
review.route("/food/get/:id").get(isAuthenticated, roleBasedAccess("customer"), GetFoodReviews)
review.route("/restaurant/get/:id").get(isAuthenticated, roleBasedAccess("customer"), GetRestaurantReviews)

export default review