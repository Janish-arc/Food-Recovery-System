import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from 'axios'

export const UserRegistration =createAsyncThunk("user/register", async(userData, {rejectWithValue}) => {
    try {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
        const {data} = await axios.post("/api/v1/user/register", userData, config)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Registration failed, Please try again later")
    }
})

export const UserLogin = createAsyncThunk("user/login", async(userData, {rejectWithValue}) => {
    try {
        const config = {
            headers : {
                "Content-Type" : "application/json"
            }
        }
        const {data} = await axios.post("/api/v1/user/login", userData, config, { withCredentials: true })
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Email or Password cannot be empty")
    }
})

export const MyProfile = createAsyncThunk("user/profile", async(_, {rejectWithValue}) => {
    try {
        const {data} = await axios.get("/api/v1/user/myprofile", {withCredentials: true})
        return data   
    } catch (error) {
        return rejectWithValue(error.response?.data || "User not found")
    }
})

export const UpdateProfile =createAsyncThunk("user/updateprofile", async(userData, {rejectWithValue}) => {
    try {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
        const {data} = await axios.put("/api/v1/user/updateprofile", userData, config)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Registration failed, Please try again later")
    }
})


export const GetAllUsers = createAsyncThunk("user/allusers", async(_, {rejectWithValue}) => {
    try {
        const {data} = await axios.get("/api/v1/user/getallusers", {withCredentials: true})
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const GetSingleUser = createAsyncThunk("user/singleuser", async(id, {rejectWithValue}) => {
    try {
        const {data} = await axios.get(`/api/v1/user/getsingleuser/${id}`)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const DeleteUser = createAsyncThunk("user/delete", async(id, {rejectWithValue}) => {
    try {
        const {data} = await axios.delete(`/api/v1/user/deleteuser/${id}`)
        return data   
    } catch (error) {
        return rejectWithValue(error.response?.data || "User not found")
    }
})

export const ForgotPassword = createAsyncThunk("user/ForgotPassword", async (emailData, {rejectWithValue}) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            };
            const { data } = await axios.post("/api/v1/user/forgotpassword", emailData, config);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const ResetPassword = createAsyncThunk("user/ResetPassword", async ({ token, password, confirmPassword }, {rejectWithValue}) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            };
            const { data } = await axios.put(`/api/v1/user/password/reset/${token}`,{password, confirmPassword}, config);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue( error.response.data.message);
        }
    }
);

const storedUser = localStorage.getItem("user")
const storedAuth = localStorage.getItem("isAuthenticated")
let parsedUser = null
try{
    parsedUser = storedUser ? JSON.parse(storedUser) : null
}catch{
    parsedUser = null
}

const UserSlice = createSlice({
    name: "user",
    initialState: {
        user: parsedUser,
        loading: false,
        error: null,
        isAuthenticated: Boolean(parsedUser),
        success: false,
        message: null,
        volunteer: [],
        users:[],
        singleuser: ""
    },
    reducers: {
        removeError : (state) => {
            state.error = null
        },
        removeSuccess: (state) => {
            state.success = false
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.success = false;
            state.error = null;
            localStorage.removeItem("user");
            localStorage.removeItem("isAuthenticated")
        }
    },
    extraReducers:(builder) => {
        builder
        .addCase(UserRegistration.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(UserRegistration.fulfilled, (state, action) => {
            state.success = action.payload?.success
            state.error = null
            state.loading = false
            state.user = action.payload?.user
            state.isAuthenticated = Boolean(action.payload?.user)
            localStorage.setItem("user", JSON.stringify(state.user))
            localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated))
        })
        .addCase(UserRegistration.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.message
            state.isAuthenticated = false
            state.user = null
        })

        builder
        .addCase(UpdateProfile.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(UpdateProfile.fulfilled, (state, action) => {
            state.success = action.payload?.success
            state.error = null
            state.loading = false
            state.user = action.payload?.updatedProfile
            state.isAuthenticated = Boolean(action.payload?.updatedProfile)
            localStorage.setItem("user", JSON.stringify(state.user))
            localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated))
        })
        .addCase(UpdateProfile.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.message
            state.isAuthenticated = false
            state.user = null
        })

        builder
        .addCase(UserLogin.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(UserLogin.fulfilled, (state, action) => {
            state.error = null
            state.loading = false
            state.success = action.payload?.success
            state.user = action.payload?.user
            state.isAuthenticated = Boolean(action.payload?.user)
            localStorage.setItem("user", JSON.stringify(state.user))
            localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated))
        })
        .addCase(UserLogin.rejected, (state, action) => {
            state.error = action.payload?.message
            state.loading = false
            state.isAuthenticated = false
            state.user = null
            localStorage.removeItem("user")
            localStorage.removeItem("isAuthenticated")
        })

        builder
        .addCase(MyProfile.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(MyProfile.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.success = action.payload?.success
            state.user = action.payload?.user
        })
        .addCase(MyProfile.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.error
        })

        builder
        .addCase(GetAllUsers.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(GetAllUsers.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.success = action.payload?.success
            state.users = action.payload?.user
        })
        .addCase(GetAllUsers.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.error
        })

        builder
        .addCase(GetSingleUser.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(GetSingleUser.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.success = action.payload?.success
            state.singleuser = action.payload?.user
        })
        .addCase(GetSingleUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.error
        })

        builder
        .addCase(DeleteUser.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(DeleteUser.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.success = action.payload?.success
        })
        .addCase(DeleteUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload?.error
        })

        builder
        .addCase(ForgotPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(ForgotPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.message = action.payload.message;
        })
        .addCase(ForgotPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        builder
        .addCase(ResetPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(ResetPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.message = action.payload.message;
        })
        .addCase(ResetPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

    }
})

export const {removeError, removeSuccess, logout} = UserSlice.actions
export default UserSlice.reducer