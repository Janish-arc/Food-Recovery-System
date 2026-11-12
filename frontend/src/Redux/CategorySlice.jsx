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

export const CreateCategory = createAsyncThunk("/category/post", async({value}, {rejectWithValue}) => {
    try {
        const config = {
            headers : {
                "Content-Type" : "multipart/form-data"
            }
        }
        const {data} = await api.post("/api/v1/category/category/create", value, config)
        return data
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const UpdateCategory = createAsyncThunk("/category/put", async({id, value}, {rejectWithValue}) => {
    try {
        
        const {data} = await api.put(`/api/v1/category/category/update/${id}`, value)
        return data
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const DeleteCategory = createAsyncThunk("/category/delete", async(id, {rejectWithValue}) => {
    try {
        const {data} = await api.delete(`/api/v1/category/category/delete/${id}`)
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

        builder
        .addCase(CreateCategory.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(CreateCategory.fulfilled, (state, action) => {
            state.loading = false
            state.category = action.payload.category
            state.success = action.payload.success
        })
        .addCase(CreateCategory.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        builder
        .addCase(UpdateCategory.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(UpdateCategory.fulfilled, (state, action) => {
            state.loading = false
            state.category = action.payload.category
            state.success = action.payload.success
        })
        .addCase(UpdateCategory.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        builder
        .addCase(DeleteCategory.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(DeleteCategory.fulfilled, (state, action) => {
            state.loading = false
            state.category = action.payload.category
            state.success = action.payload.success
        })
        .addCase(DeleteCategory.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
    }
})

export const {removeError, removeSuccess} = CategorySlice.actions
export default CategorySlice.reducer