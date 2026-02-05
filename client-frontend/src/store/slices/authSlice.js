// authSlice.js - Redux slice for authentication (works with your existing authService)

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService.js'; // Adjust path as needed

// Async thunks using your existing auth service
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const result = await authService.register(userData);
            
            if (!result.success) {
                return rejectWithValue(result.message);
            }
            
            return result;
        } catch (error) {
            return rejectWithValue(error.message || 'Registration failed');
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (userData, { rejectWithValue }) => {
        try {
            const result = await authService.login(userData);
            
            if (!result.success) {
                return rejectWithValue(result.message);
            }
            
            return result;
        } catch (error) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.signOut();
            return null;
        } catch (error) {
            return rejectWithValue(error.message || 'Logout failed');
        }
    }
);

export const getUserProfile = createAsyncThunk(
    'auth/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const result = await authService.getProfile();
            
            if (!result.success) {
                return rejectWithValue(result.message);
            }
            
            return result;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch profile');
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const result = await authService.updateProfile(userData);
            
            if (!result.success) {
                return rejectWithValue(result.message);
            }
            
            return result;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update profile');
        }
    }
);

export const changeUserPassword = createAsyncThunk(
    'auth/changePassword',
    async (passwordData, { rejectWithValue }) => {
        try {
            const result = await authService.changePassword(passwordData);
            
            if (!result.success) {
                return rejectWithValue(result.message);
            }
            
            return result;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to change password');
        }
    }
);

// Get initial state from localStorage
const getUserFromStorage = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        return null;
    }
};

const getTokenFromStorage = () => {
    return localStorage.getItem('token') || null;
};

// Initial state
const initialState = {
    user: getUserFromStorage(),
    token: getTokenFromStorage(),
    isAuthenticated: !!(getTokenFromStorage() && getUserFromStorage()),
    loading: false,
    error: null,
    message: null
};

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        clearAuth: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            state.message = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        // Load user from localStorage on app start
        loadUserFromStorage: (state) => {
            const user = getUserFromStorage();
            const token = getTokenFromStorage();
            
            if (user && token) {
                state.user = user;
                state.token = token;
                state.isAuthenticated = true;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            
            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = null;
                state.message = 'Logged out successfully';
            })
            .addCase(logoutUser.rejected, (state, action) => {
                // Even if logout fails, clear local state
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = action.payload;
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            })
            
            // Get profile
            .addCase(getUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Update profile
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                // User is already updated in localStorage by the service
                state.user = getUserFromStorage();
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Change password
            .addCase(changeUserPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeUserPassword.fulfilled, (state) => {
                state.loading = false;
                state.message = 'Password changed successfully';
            })
            .addCase(changeUserPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Actions
export const { 
    clearError, 
    clearMessage, 
    setUser, 
    clearAuth,
    loadUserFromStorage 
} = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthMessage = (state) => state.auth.message;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;