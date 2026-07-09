import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const CreateRestaurant =createAsyncThunk("restaurant/create", async(restaurant, {rejectWithValue}) => {
    try {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
        const {data} = await api.post("/api/v1/restaurant/restaurant/create", restaurant, config)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Registration failed, Please try again later")
    }
})

export const GetRestaurant = createAsyncThunk("/restaurant/get", async(_, {rejectWithValue}) => {
    try {
        const {data} = await api.get("/api/v1/restaurant/restaurant/get/allrestaurant")
        return data
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const GetMyRestaurant = createAsyncThunk("/myrestaurant/get", async(_, {rejectWithValue}) => {
    try {
        const {data} = await api.get("/api/v1/restaurant/restaurant/get/mine")
        return data
    } catch (error) {
        return rejectWithValue(error.message)
    }
})


export const GetSingleRestaurant = createAsyncThunk("/restaurant/get/single", async(id, {rejectWithValue}) => {
    try {
        const {data} = await api.get(`/api/v1/restaurant/restaurant/get/${id}`, {withCredentials: true})
        return data
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

const RestaurantSlice = createSlice({
    name: "restaurant",
    initialState: {
        restaurants: [],
        restaurant: " ",
        myrestaurant: " ",
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
        .addCase(CreateRestaurant.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(CreateRestaurant.fulfilled, (state, action) => {
            state.loading = false
            state.restaurant = action.payload.restaurant
            state.success = action.payload.success
        })
        .addCase(CreateRestaurant.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        builder
        .addCase(GetRestaurant.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(GetRestaurant.fulfilled, (state, action) => {
            state.loading = false
            state.restaurants = action.payload.restaurants
            state.success = action.payload.success
        })
        .addCase(GetRestaurant.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        builder
        .addCase(GetMyRestaurant.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(GetMyRestaurant.fulfilled, (state, action) => {
            state.loading = false
            state.myrestaurant = action.payload.restaurant
            state.success = action.payload.success
        })
        .addCase(GetMyRestaurant.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })


        builder
        .addCase(GetSingleRestaurant.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(GetSingleRestaurant.fulfilled, (state, action) => {
            state.loading = false
            state.restaurant = action.payload.restaurant
            state.success = action.payload.success
        })
        .addCase(GetSingleRestaurant.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
    }
})

export const {removeError, removeSuccess} = RestaurantSlice.actions
export default RestaurantSlice.reducer