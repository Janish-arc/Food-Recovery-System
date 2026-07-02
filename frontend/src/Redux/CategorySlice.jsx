import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const GetCategory = createAsyncThunk("/category/get", async(_, {rejectWithValue}) => {
    try {
        const {data} = await api.get("/api/v1/category/category/get", {withCredentials: true})
        return data
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

const CategorySlice = createSlice({
    name: "category",
    initialState: {
        category: [],
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
        .addCase(GetCategory.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(GetCategory.fulfilled, (state, action) => {
            state.loading = false
            state.category = action.payload.category
            state.success = action.payload.success
        })
        .addCase(GetCategory.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
    }
})

export const {removeError, removeSuccess} = CategorySlice.actions
export default CategorySlice.reducer