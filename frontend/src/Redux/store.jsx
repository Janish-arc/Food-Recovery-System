import { configureStore } from "@reduxjs/toolkit";
import UserSlice from './UserSlice'
import FoodSlice from './FoodSlice'
import CategorySlice from './CategorySlice'
import RestaurantSlice from './RestaurantSlice'
import CartSlice from './CartSlice'
import OrderSlice from './OrderSlice'
import ReviewSlice from './ReviewSlice'

export const store = configureStore({
    reducer: {
        user: UserSlice,
        food: FoodSlice,
        category: CategorySlice,
        restaurant: RestaurantSlice,
        cart: CartSlice,
        order: OrderSlice,
        review: ReviewSlice
    }
})