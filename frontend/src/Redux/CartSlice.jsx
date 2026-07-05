import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const CreateCart = createAsyncThunk("create/cart", async(datas, {rejectWithValue}) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const {data} = await api.post("/api/v1/cart/cart/create", datas, config)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const GetCart = createAsyncThunk("get/cart", async(_, {rejectWithValue}) => {
    try {
        const {data} = await api.get("/api/v1/cart/cart/get", {withCredentials: true})
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const UpdateCart = createAsyncThunk("update/cart", async({id, datas}, {rejectWithValue}) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const {data} = await api.put(`/api/v1/cart/cart/update/${id}`, datas, config)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const DeleteCart = createAsyncThunk("delete/cart", async(id, {rejectWithValue}) => {
    try {
        const {data} = await api.delete(`/api/v1/cart/cart/remove/${id}`, {withCredentials: true})
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

const CartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: [],
        loading: true, 
        success: false, 
        error: null,
        message: null
    },
    reducers: {
        removeError: (state) => {
            state.error = null
        },
        removeSuccess: (state) => {
            state.success = false
        },
        
    },
    extraReducers:(builder) => {
        builder.addCase(CreateCart.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(CreateCart.fulfilled, (state, action) => {
            state.loading = false
            state.cart = action.payload.cart
            state.success = action.payload.success
        })
        .addCase(CreateCart.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.error
        })

        builder.addCase(GetCart.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(GetCart.fulfilled, (state, action) => {
            state.loading = false
            state.cart = action.payload.cart
            state.success = action.payload.success
        })
        .addCase(GetCart.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.error
        })

        builder.addCase(UpdateCart.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(UpdateCart.fulfilled, (state, action) => {
            state.loading = false
            state.cart = action.payload.cart
            state.success = action.payload.success
        })
        .addCase(UpdateCart.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.error
        })

        builder.addCase(DeleteCart.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(DeleteCart.fulfilled, (state, action) => {
            state.loading = false
            state.success = action.payload.success
        })
        .addCase(DeleteCart.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.error
        })
    }
})

export const {removeError, removeSuccess} = CartSlice.actions
export default CartSlice.reducer