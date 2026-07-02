import express from 'express'
import multer from 'multer'
import { isAuthenticated, roleBasedAccess } from '../helper/UserAuth.js'
import { CreateCategory, DeleteCategory, GetCategory, UpdateCategory } from '../controller/CategoryController.js'

const category = express.Router()
const storage = multer.memoryStorage()
const upload = multer({storage})

category.route("/category/create").post(upload.single("image"), isAuthenticated, roleBasedAccess("admin"), CreateCategory)
category.route("/category/get").get(isAuthenticated, GetCategory)
category.route("/category/update/:id").put(upload.single("image"), isAuthenticated, roleBasedAccess("admin"), UpdateCategory)
category.route("/category/delete/:id").delete(isAuthenticated, roleBasedAccess("admin"), DeleteCategory)

export default category