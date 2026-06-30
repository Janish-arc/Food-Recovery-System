import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../api";

export const DonateFood = createAsyncThunk("food/donate", async(foodData, {rejectWithValue}) => {
    try {
        const config = {
            headers:{
                "Content-Type": "multipart/form-data"
            }
        }
        const {data} = await api.post("/api/v1/food/donorfood", foodData, config)
        console.log(data);
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const GetDonorFoods = createAsyncThunk("get/foods", async(_, {rejectWithValue}) => {
    try {
        const {data} = await api.get("/api/v1/food/getsingledonorfood", {withCredentials: true})
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const GetAllFoods = createAsyncThunk("get/allfoods", async(_, {rejectWithValue}) => {
    try {
        const {data} = await api.get("/api/v1/food/getallfoods", {withCredentials: true})
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const GetSingleFood = createAsyncThunk("get/singlefood", async(id, {rejectWithValue}) => {
    try {
        const {data} = await api.get(`/api/v1/food/getsinglefood/${id}`, {withCredentials: true})
        console.log(data); 
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const GetSingleNgoFood = createAsyncThunk("get/singlengofood", async(_, {rejectWithValue}) => {
    try {
        const {data} = await api.get("/api/v1/food/getsingleNgofoods", {withCredentials: true})
        console.log(data); 
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const AcceptsFood = createAsyncThunk("food/acceptsfood", async(id, {rejectWithValue}) => {
    try {
        const {data} = await api.put(`/api/v1/food/acceptsfood/${id}`)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const GetAcceptedFood = createAsyncThunk("food/acceptedfood", async(_, {rejectWithValue}) => {
    try {
        const {data} = await api.get("/api/v1/food/getacceptedfood", {withCredentials: true})
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const CancelFood = createAsyncThunk("food/cancelsfood", async(id, {rejectWithValue}) => {
    try {
        const {data} = await api.put(`/api/v1/food/cancelorder/${id}`)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const PickupFood = createAsyncThunk("food/pickupfood",async(id, {rejectWithValue}) => {
        try{
            const {data} = await api.put(`/api/v1/food/status/picked/${id}`)
            return data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const AssignedFood = createAsyncThunk("food/assignfood",async(id, {rejectWithValue}) => {
        try{
            const {data} = await api.put(`/api/v1/food/status/assigned/${id}`)
            return data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const MyDelivery = createAsyncThunk("/food/mydeliveries", async(_, {rejectWithValue}) => {
    try {
        const {data} = await api.get("/api/v1/food/mydeliveries", {withCredentials: true})
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const DeliveredFood = createAsyncThunk("food/deliveredfood",async(id, {rejectWithValue}) => {
        try{
            const {data} = await api.put(`/api/v1/food/status/delivered/${id}`)
            return data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const DeleteFood = createAsyncThunk("food/deletefood", async(id, {rejectWithValue}) => {
    try {
        const {data} = await api.delete(`/api/v1/food/deletefood/${id}`)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

const FoodSlice = createSlice({
    name: "food",
    initialState: {
        food: [],
        loading: false,
        error: null,
        success: false,
        message: null,
        singlefood: "",
        acceptedFood:[],
        mydeliveries:[],
        mydelivery:[]
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
        builder.addCase(DonateFood.pending, (state) => {
            state.error = null
            state.loading = true
        })
        .addCase(DonateFood.fulfilled, (state, action) => {
            state.error = null
            state.loading = false
            state.success = action.payload?.success
        })
        .addCase(DonateFood.rejected, (state, action) => {
            state.error = action.payload || action.error?.message
            state.loading = false
        })

        builder.addCase(GetDonorFoods.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(GetDonorFoods.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.food = action.payload?.foods
        })
        .addCase(GetDonorFoods.rejected, (state, action) => {
            state.error = action.payload?.error
            state.loading = false
        })

        builder.addCase(GetAllFoods.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(GetAllFoods.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.food = action.payload?.foods
        })
        .addCase(GetAllFoods.rejected, (state, action) => {
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
            state.singlefood = action.payload?.food
        })
        .addCase(GetSingleFood.rejected, (state, action) => {
            state.error = action.payload?.error
            state.loading = false
        })

        builder.addCase(GetSingleNgoFood.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(GetSingleNgoFood.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.acceptedFood = action.payload?.food
        })
        .addCase(GetSingleNgoFood.rejected, (state, action) => {
            state.error = action.payload?.error
            state.loading = false
        })

        builder.addCase(AcceptsFood.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(AcceptsFood.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.success = action.payload?.success
        })
        .addCase(AcceptsFood.rejected, (state, action) => {
            state.error = action.payload?.error
            state.loading = false
        })      
        
        builder.addCase(CancelFood.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(CancelFood.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.success = action.payload?.success
        })
        .addCase(CancelFood.rejected, (state, action) => {
            state.error = action.payload?.error
            state.loading = false
        })  

        builder.addCase(PickupFood.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(PickupFood.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.success = action.payload?.success
            state.food = action.payload?.food
        })
        .addCase(PickupFood.rejected, (state, action) => {
            state.error = action.payload?.error
            state.loading = false
        }) 
        
        builder.addCase(AssignedFood.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(AssignedFood.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.success = action.payload?.success
            state.mydeliveries = action.payload?.food
        })
        .addCase(AssignedFood.rejected, (state, action) => {
            state.error = action.payload?.error
            state.loading = false
        }) 

        builder.addCase(MyDelivery.pending, (state) => {
            state.error = null
            state.loading = true
        })
        .addCase(MyDelivery.fulfilled, (state, action) => {
            state.error = null
            state.loading = false
            state.mydelivery = Array.isArray(action.payload?.food) ? action.payload.food : [];
            state.success = action.payload?.success
        })
        .addCase(MyDelivery.rejected, (state, action) => {
            state.success = false
            state.error = action.payload?.error
        })

        builder.addCase(DeliveredFood.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(DeliveredFood.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.success = action.payload?.success
        })
        .addCase(DeliveredFood.rejected, (state, action) => {
            state.error = action.payload?.error
            state.loading = false
        })  

        builder.addCase(GetAcceptedFood.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(GetAcceptedFood.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.food = action.payload?.foods
        })
        .addCase(GetAcceptedFood.rejected, (state, action) => {
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