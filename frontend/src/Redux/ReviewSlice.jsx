import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../api";


export const CreateRestaurantReview = createAsyncThunk("/review/restaurant", async (datas, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const { data } = await api.post("/api/v1/review/restaurant/create", datas, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

export const CreateFoodReview = createAsyncThunk("/review/food", async (datas, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            },
        };
        const { data } = await api.post("/api/v1/review/food/create", datas, config)
        return data 
    } catch (error) {
        return rejectWithValue(error?.response?.data)
    }
})

export const GetUserReview = createAsyncThunk("/user/review", async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/api/v1/review/user/review");
            return data;
            
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const GetFoodReviews = createAsyncThunk("/food/get", async(id, {rejectWithValue}) => {
    try {
        const {data} = await api.get(`/api/v1/review/food/get/${id}`, {withCredentials: true})
        return data
    } catch (error) {
        return rejectWithValue(error?.response?.data)
    }
})

export const GetRestaurantReviews = createAsyncThunk("/restaurant/get", async(id, {rejectWithValue}) => {
    try {
        const {data} = await api.get(`/api/v1/review/restaurant/get/${id}`, {withCredentials: true})
        return data
        console.log(data)
    } catch (error) {
        return rejectWithValue(error?.response?.data)
    }
})


const ReviewSlice = createSlice({
    name: "review",
    initialState: {
        restaurantReviews: [],
        foodReviews: [],
        restaurantReviewCount: 0,
        foodReviewCount: 0,
        userReview: 0,
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
        .addCase(CreateRestaurantReview.pending, (state) => {
            state.loading = true;
        })
        .addCase(CreateRestaurantReview.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
        })
        .addCase(CreateRestaurantReview.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message;
        })

        builder
        .addCase(CreateFoodReview.pending, (state) => {
            state.loading = true;
        })
        .addCase(CreateFoodReview.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
        })
        .addCase(CreateFoodReview.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message;
        })

        builder
        .addCase(GetUserReview.pending, (state) => {
            state.loading = true;
        })
        .addCase(GetUserReview.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
            state.userReview = action.payload?.reviewCount
        })
        .addCase(GetUserReview.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message;
        })

        builder
        .addCase(GetFoodReviews.pending, (state) => {
            state.loading = true;
        })
        .addCase(GetFoodReviews.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
            state.foodReviews = action.payload?.reviews
            state.foodReviewCount = action.payload?.count
        })
        .addCase(GetFoodReviews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message;
        })

        builder
        .addCase(GetRestaurantReviews.pending, (state) => {
            state.loading = true;
        })
        .addCase(GetRestaurantReviews.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
            state.restaurantReviews = action.payload?.reviews
            console.log(action.payload?.reviews)
            state.restaurantReviewCount = action.payload?.count
        })
        .addCase(GetRestaurantReviews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message;
        })
    }

})

export const {removeError, removeSuccess} = ReviewSlice.actions
export default ReviewSlice.reducer