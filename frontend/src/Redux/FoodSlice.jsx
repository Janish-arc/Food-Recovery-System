import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../api";

export const GetRestaurantFoods = createAsyncThunk("get/restaurant/foods", async(restaurantId, {rejectWithValue}) => {
    try {
        const {data} = await api.get(`/api/v1/food/menu/restaurant/${restaurantId}`, {withCredentials: true})
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const GetAllFoods = createAsyncThunk("get/allfoods", async(_, {rejectWithValue}) => {
    try {
        const {data} = await api.get("/api/v1/food/menu/get/allmenu")
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const GetSingleFood = createAsyncThunk("get/single/food", async(id, {rejectWithValue}) => {
    try {
        const {data} = await api.get(`/api/v1/food/menu/${id}`)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const GetSingleCategoryFood = createAsyncThunk("get/single/category/food", async({id, sort}, {rejectWithValue}) => {
    try {
        const {data} = await api.get(`/api/v1/food/menu/category/get/${id}?sort=${sort}`)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const GetMenuOfRestaurant = createAsyncThunk("get/restaurant/allfoods", async(_, {rejectWithValue}) => {
    try {
        const {data} = await api.get("/api/v1/food/menu/restaurant/foods")
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const ToggleFoodAvailability = createAsyncThunk("food/toggleAvailability", async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/api/v1/food/menu/toggle/availablity/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const DeleteFood = createAsyncThunk("food/deletefood", async(id, {rejectWithValue}) => {
    try {
        const {data} = await api.delete(`/api/v1/food/menu/delete/${id}`)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

const FoodSlice = createSlice({
    name: "food",
    initialState: {
        food: [],
        restaurantfood: [],
        resFood: [],
        loading: false,
        error: null,
        success: false,
        message: null,
        SingleFood: "",
        categoryFoods: []
    },
    reducers: {
        removeError : (state) => {
            state.error = null
        },
        removeSuccess: (state) => {
            state.success = false
        }
    },
    extraReducers:(builder) => {
        
        builder.addCase(GetAllFoods.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(GetAllFoods.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.food = action.payload?.food
        })
        .addCase(GetAllFoods.rejected, (state, action) => {
            state.error = action.payload?.error
            state.loading = false
        })

        builder.addCase(ToggleFoodAvailability.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(ToggleFoodAvailability.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.food = action.payload?.food
        })
        .addCase(ToggleFoodAvailability.rejected, (state, action) => {
            state.error = action.payload?.error
            state.loading = false
        })

        builder.addCase(GetMenuOfRestaurant.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(GetMenuOfRestaurant.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.resFood = action.payload?.foods
        })
        .addCase(GetMenuOfRestaurant.rejected, (state, action) => {
            state.error = action.payload?.error
            state.loading = false
        })

        builder.addCase(GetRestaurantFoods.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(GetRestaurantFoods.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.restaurantfood = action.payload?.foods
        })
        .addCase(GetRestaurantFoods.rejected, (state, action) => {
            state.error = action.payload?.error
            state.loading = false
        })

        builder.addCase(GetSingleFood.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(GetSingleFood.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.SingleFood = action.payload?.food
        })
        .addCase(GetSingleFood.rejected, (state, action) => {
            state.error = action.payload?.error
            state.loading = false
        })

        builder.addCase(GetSingleCategoryFood.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(GetSingleCategoryFood.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.categoryFoods = action.payload?.food
        })
        .addCase(GetSingleCategoryFood.rejected, (state, action) => {
            state.error = action.payload?.error
            state.loading = false
        })

        builder.addCase(DeleteFood.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(DeleteFood.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.success = action.payload?.success
        })
        .addCase(DeleteFood.rejected, (state, action) => {
            state.error = action.payload?.error
            state.loading = false
        })  
    }

})

export const {removeError, removeSuccess} = FoodSlice.actions
export default FoodSlice.reducer