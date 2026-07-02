import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const GetRestaurant = createAsyncThunk("/restaurant/get", async(_, {rejectWithValue}) => {
    try {
        const {data} = await api.get("/api/v1/restaurant/restaurant/get/allrestaurant", {withCredentials: true})
        return data
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

const RestaurantSlice = createSlice({
    name: "restaurant",
    initialState: {
        restaurant: [],
        loading: false,
        error: null,
        success: false,
        message: null
    },
    reducers: {
        removeError: (state) => {
            state.error = null
        },
        removeSuccess: (state) => {
            state.success = false
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(GetRestaurant.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(GetRestaurant.fulfilled, (state, action) => {
            state.loading = false
            state.restaurant = action.payload.restaurant
            state.success = action.payload.success
        })
        .addCase(GetRestaurant.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
    }
})

export const {removeError, removeSuccess} = RestaurantSlice.actions
export default RestaurantSlice.reducer