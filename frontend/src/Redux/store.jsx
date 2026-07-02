import { configureStore } from "@reduxjs/toolkit";
import UserSlice from './UserSlice'
import FoodSlice from './FoodSlice'
import CategorySlice from './CategorySlice'
import RestaurantSlice from './RestaurantSlice'

export const store = configureStore({
    reducer: {
        user: UserSlice,
        food: FoodSlice,
        category: CategorySlice,
        restaurant: RestaurantSlice
    }
})