import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const UserRegistration = createAsyncThunk("user/register", async (userData, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        const { data } = await api.post("/api/v1/user/register", userData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Registration failed, Please try again later");
    }
});

export const UserLogin = createAsyncThunk("user/login", async (userData, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await api.post("/api/v1/user/login", userData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Email or Password cannot be empty");
    }
});

export const MyProfile = createAsyncThunk("user/profile", async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get("/api/v1/user/myprofile", {
            withCredentials: true
        });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Session expired");
    }
});

export const UpdateProfile = createAsyncThunk("user/updateprofile", async (userData, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        const { data } = await api.put("/api/v1/user/updateprofile", userData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Profile update failed");
    }
});

export const GetAllUsers = createAsyncThunk("user/allusers", async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get("/api/v1/user/getallusers", {
            withCredentials: true
        });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to get users");
    }
});

export const GetSingleUser = createAsyncThunk("user/singleuser", async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.get(`/api/v1/user/getsingleuser/${id}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "User not found");
    }
});

export const DeleteUser = createAsyncThunk("user/delete", async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.delete(`/api/v1/user/deleteuser/${id}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "User not found");
    }
});

export const ForgotPassword = createAsyncThunk("user/ForgotPassword", async (emailData, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await api.post("/api/v1/user/forgotpassword", emailData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
});

export const ResetPassword = createAsyncThunk("user/ResetPassword", async ({ token, password, confirmPassword }, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await api.put(`/api/v1/user/password/reset/${token}`, { password, confirmPassword }, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
});

const clearAuth = (state) => {
    state.user = null;
    state.isAuthenticated = false;
    state.authLoading = false;
    localStorage.removeItem("user");
};

const UserSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        loading: false,
        authLoading: true,
        error: null,
        isAuthenticated: false,
        success: false,
        message: null,
        volunteer: [],
        users: [],
        singleuser: ""
    },
    reducers: {
        removeError: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.success = false;
        },
        logout: (state) => {
            clearAuth(state);
            state.success = false;
            state.error = null;
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(UserRegistration.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(UserRegistration.fulfilled, (state, action) => {
            state.loading = false;
            state.authLoading = false;
            state.error = null;
            state.success = action.payload?.success;
            state.user = action.payload?.user || null;
            state.isAuthenticated = Boolean(action.payload?.user);

            if (state.user) {
                localStorage.setItem("user", JSON.stringify(state.user));
            }
        })
        .addCase(UserRegistration.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Registration failed";
            clearAuth(state);
        })

        .addCase(UserLogin.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(UserLogin.fulfilled, (state, action) => {
            state.loading = false;
            state.authLoading = false;
            state.error = null;
            state.success = action.payload?.success;
            state.user = action.payload?.user || null;
            state.isAuthenticated = Boolean(action.payload?.user);

            if (state.user) {
                localStorage.setItem("user", JSON.stringify(state.user));
            }
        })
        .addCase(UserLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Login failed";
            clearAuth(state);
        })

        .addCase(MyProfile.pending, (state) => {
            state.authLoading = true;
            state.error = null;
        })
        .addCase(MyProfile.fulfilled, (state, action) => {
            const loggedUser = action.payload?.user;

            state.authLoading = false;
            state.loading = false;

            if (loggedUser) {
                state.user = loggedUser;
                state.isAuthenticated = true;
                state.error = null;
                localStorage.setItem("user", JSON.stringify(loggedUser));
            } else {
                clearAuth(state);
            }
        })
        .addCase(MyProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || action.payload?.error || "Session expired";
            clearAuth(state);
        })

        .addCase(UpdateProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(UpdateProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = action.payload?.success;
            state.user = action.payload?.updatedProfile || null;
            state.isAuthenticated = Boolean(action.payload?.updatedProfile);

            if (state.user) {
                localStorage.setItem("user", JSON.stringify(state.user));
            }
        })
        .addCase(UpdateProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Profile update failed";
        })

        .addCase(GetAllUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(GetAllUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = action.payload?.success;
            state.users = action.payload?.user || [];
        })
        .addCase(GetAllUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || action.payload?.error || "Failed to get users";
        })

        .addCase(GetSingleUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(GetSingleUser.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = action.payload?.success;
            state.singleuser = action.payload?.user;
        })
        .addCase(GetSingleUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || action.payload?.error || "User not found";
        })

        .addCase(DeleteUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(DeleteUser.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = action.payload?.success;
        })
        .addCase(DeleteUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || action.payload?.error || "Delete failed";
        })

        .addCase(ForgotPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(ForgotPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.message = action.payload?.message;
        })
        .addCase(ForgotPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(ResetPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(ResetPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.message = action.payload?.message;
        })
        .addCase(ResetPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export const { removeError, removeSuccess, logout } = UserSlice.actions;
export default UserSlice.reducer;