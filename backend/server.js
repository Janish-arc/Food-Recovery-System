import express from "express";
import dotenv from "dotenv";
import { connectiondb } from "./config/db.js";
import {v2 as cloudinary} from "cloudinary"
import food from "./routes/FoodRoutes.js";
import cookieParser from "cookie-parser";
import user from "./routes/UserRoutes.js";
import error from "./helper/error.js"
import cors from "cors";
import restaurant from "./routes/RestaurantRoute.js";
import category from "./routes/CategoryRoute.js";
import cart from "./routes/CartRoute.js";
import order from "./routes/OrderRoute.js";
import review from "./routes/ReviewRoute.js";

dotenv.config({ path: "./config/.env" });

const app = express();
console.log("PORT =", process.env.PORT);
console.log("MONGO_URL =", process.env.MONGO_URL);
// Connect Database
connectiondb();
cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
    });
app.use(
  cors({
    origin: ["http://localhost:5173","https://food-recovery-system.vercel.app"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/food", food);
app.use("/api/v1/user", user);
app.use("/api/v1/restaurant", restaurant)
app.use("/api/v1/category", category)
app.use("/api/v1/cart", cart)
app.use("/api/v1/order", order)
app.use("/api/v1/review", review)
app.use(error);

app.get("/", (req, res) => {
  res.send("Recupy API Running");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});