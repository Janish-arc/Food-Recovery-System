import { configureStore } from "@reduxjs/toolkit";
import UserSlice from './UserSlice'
import FoodSlice from './FoodSlice'

export const store = configureStore({
    reducer: {
        user: UserSlice,
        food: FoodSlice
    }
})