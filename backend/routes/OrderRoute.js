import express from 'express'
import { isAuthenticated, roleBasedAccess } from '../helper/UserAuth.js'
import { CreateOrder, GetMyOrders, GetSingleOrder, CancelOrder, GetRestaurantOrders } from '../controller/OrderController.js'

const order = express.Router()

order.route("/order/create").post(isAuthenticated, roleBasedAccess("customer"), CreateOrder)
order.route("/order/get").get(isAuthenticated, roleBasedAccess("customer"), GetMyOrders)
order.route("/order/get/:id").get(isAuthenticated, roleBasedAccess("customer"), GetSingleOrder)
order.route("/order/cancel/:id").delete(isAuthenticated, roleBasedAccess("customer"), CancelOrder)
order.route("/order/restaurantOrders").get(isAuthenticated, roleBasedAccess("restaurant"), GetRestaurantOrders)

export default order