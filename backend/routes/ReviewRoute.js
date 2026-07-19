import express from 'express'
import { isAuthenticated, roleBasedAccess } from '../helper/UserAuth.js'
import {CreateRestaurantReview, GetMyReviewCount} from '../controller/ReviewController.js'


const review = express.Router()

review.route("/restaurant/create").post(isAuthenticated, roleBasedAccess("customer"), CreateRestaurantReview)
review.route("/user/review").get(isAuthenticated, roleBasedAccess("customer"), GetMyReviewCount)

export default review