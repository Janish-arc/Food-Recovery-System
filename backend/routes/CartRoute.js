import express from 'express'
import multer from 'multer'
import { isAuthenticated, roleBasedAccess } from '../helper/UserAuth.js'
import { ClearCart, CreateCart, GetCart, RemoveCartItem, UpdateCart } from '../controller/CartController.js'

const cart = express.Router()
const storage = multer.memoryStorage()
const upload = multer({storage})

cart.route("/cart/create").post(isAuthenticated, CreateCart)
cart.route("/cart/get").get(isAuthenticated, GetCart)
cart.route("/cart/update/:id").put(isAuthenticated, UpdateCart)
cart.route("/cart/remove/:id").delete(isAuthenticated, RemoveCartItem)
cart.route("/cart/clear").delete(isAuthenticated, ClearCart)

export default cart