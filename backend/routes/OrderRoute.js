import express from 'express'
import { isAuthenticated, roleBasedAccess } from '../helper/UserAuth.js'
import { CreateOrder, GetMyOrders, GetSingleOrder, CancelOrder, GetRestaurantOrders, GetOrdersByAdmin } from '../controller/OrderController.js'

const order = express.Router()

order.route("/order/create").post(isAuthenticated, CreateOrder)
order.route("/order/get").get(isAuthenticated, GetMyOrders)
order.route("/order/get/:id").get(isAuthenticated, GetSingleOrder)
order.route("/order/cancel/:id").delete(isAuthenticated, CancelOrder)
order.route("/order/restaurantOrders").get(isAuthenticated, roleBasedAccess("restaurant"), GetRestaurantOrders)
order.route("/order/all/orders").get(isAuthenticated, roleBasedAccess("admin"), GetOrdersByAdmin)

export default order