import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const CreateOrder = createAsyncThunk("/order/create", async(datas, {rejectWithValue}) => {
    try {
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }
        const {data} = await api.post("/api/v1/order/order/create", datas, config)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const GetOrdersByAdmin = createAsyncThunk("/order/get/admin", async(_, {rejectWithValue}) => {
    try {
        const {data} = await api.get("/api/v1/order/order/all/orders", {withCredentials: true})
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const GetMyOrder = createAsyncThunk("/order/get", async(_, {rejectWithValue}) => {
    try {
        const {data} = await api.get("/api/v1/order/order/get", {withCredentials: true})
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const GetSingleOrder = createAsyncThunk("/order/get/one", async(id, {rejectWithValue}) => {
    try {
        const {data} = await api.get(`/api/v1/order/order/get/${id}`, {withCredentials: true})
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const GetRestaurantOrder = createAsyncThunk("/order/restaurantOrders", async(_, {rejectWithValue}) => {
    try {
        const {data} = await api.get("/api/v1/order/order/restaurantOrders", {withCredentials: true})
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const CancelOrder = createAsyncThunk("/order/cancel", async(id, {rejectWithValue}) => {
    try {
        const {data} = await api.delete(`/api/v1/order/order/cancel/${id}`, {withCredentials: true})
        console.log(data)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})



const OrderSlice = createSlice({
    name: "order",
    initialState: {
        order: [],
        adminOrder: [],
        singleOrder: "",
        loading: true, 
        success: false,
        error: null,
        message: null
    },
    reducers: {
        removerError: (state) => {
            state.error = null
        },
        removeSuccess: (state) => {
            state.success = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(CreateOrder.pending, (state) => {
            state.loading = true
            state.success = false
        })
        .addCase(CreateOrder.fulfilled, (state, action) => {
            state.loading = false
            state.success = action.payload.success
            state.order = action.payload.order
            state.error = action.payload.error
        })
        .addCase(CreateOrder.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.error
        })

        builder.addCase(GetMyOrder.pending, (state) => {
            state.loading = true
            state.success = false
        })
        .addCase(GetMyOrder.fulfilled, (state, action) => {
            state.loading = false
            state.success = action.payload.success
            state.order = action.payload.orders
            state.error = action.payload.error
        })
        .addCase(GetMyOrder.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.error
        })

        builder.addCase(GetRestaurantOrder.pending, (state) => {
            state.loading = true
            state.success = false
        })
        .addCase(GetRestaurantOrder.fulfilled, (state, action) => {
            state.loading = false
            state.success = action.payload.success
            state.order = action.payload.order
            state.error = action.payload.error
        })
        .addCase(GetRestaurantOrder.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.error
        })

        builder.addCase(GetSingleOrder.pending, (state) => {
            state.loading = true
            state.success = false
        })
        .addCase(GetSingleOrder.fulfilled, (state, action) => {
            state.loading = false
            state.success = action.payload.success
            state.singleOrder = action.payload.order
            state.error = action.payload.error
        })
        .addCase(GetSingleOrder.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.error
        })

        builder.addCase(GetOrdersByAdmin.pending, (state) => {
            state.loading = true
            state.success = false
        })
        .addCase(GetOrdersByAdmin.fulfilled, (state, action) => {
            state.loading = false
            state.success = action.payload.success
            state.adminOrder = action.payload.order
            state.error = action.payload.error
        })
        .addCase(GetOrdersByAdmin.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.error
        })

        builder.addCase(CancelOrder.pending, (state) => {
            state.loading = true
            state.success = false
        })
        .addCase(CancelOrder.fulfilled, (state, action) => {
            state.loading = false
            state.success = action.payload.success
            state.error = action.payload.error
        })
        .addCase(CancelOrder.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.error
        })
    }
})

export default OrderSlice.reducer
export const {removeSuccess, removerError} = OrderSlice.actions