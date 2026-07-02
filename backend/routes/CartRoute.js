import express from 'express'
import multer from 'multer'
import { isAuthenticated, roleBasedAccess } from '../helper/UserAuth.js'
import { ClearCart, CreateCart, GetCart, RemoveCartItem, UpdateCart } from '../controller/CartController.js'

const cart = express.Router()
const storage = multer.memoryStorage()
const upload = multer({storage})

cart.route("/cart/create").post(isAuthenticated, roleBasedAccess("customer"), CreateCart)
cart.route("/cart/get").get(isAuthenticated, roleBasedAccess("customer"), GetCart)
cart.route("/cart/update/:id").put(isAuthenticated, roleBasedAccess("customer"), UpdateCart)
cart.route("/cart/remove/:id").delete(isAuthenticated, roleBasedAccess("customer"), RemoveCartItem)
cart.route("/cart/clear").delete(isAuthenticated, roleBasedAccess("customer"), ClearCart)

export default cart