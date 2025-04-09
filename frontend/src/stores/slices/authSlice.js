import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

const initialState = {
  user: null,
  loading: false,
  error: null,
  reset_token: null,
};

const authUrl = import.meta.env.VITE_API_URL + "/auth";

export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post(`${authUrl}/users`, userData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post(`${authUrl}/sessions`, credentials, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await API.delete(`${authUrl}/sessions`, { withCredentials: true });
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await API.put(`${authUrl}/profile`, profileData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Profile update failed");
    }
  }
);

export const changeRole = createAsyncThunk(
  "auth/changeRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await API.put(`${authUrl}/users/${userId}/role`, {
        role,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Role update failed");
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (email, { rejectWithValue }) => {
    try {
      const response = await API.post(`${authUrl}/password/reset-request`, {
        email,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Reset request failed");
    }
  }
);

export const checkPasswordCode = createAsyncThunk(
  "auth/checkPasswordCode",
  async (code, { rejectWithValue }) => {
    try {
      const response = await API.post(`${authUrl}/password/reset-code`, code);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Code check failed");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (resetData, { rejectWithValue }) => {
    try {
      const response = await API.post(`${authUrl}/password/reset`, resetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Password reset failed");
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  "auth/checkUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`${authUrl}/check-user`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Password reset failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setResetToken: (state, action) => {
      state.reset_token = action.payload;
    },
    removeResetToken: (state) => {
      state.reset_token = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    removeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addCase(changeRole.fulfilled, (state, action) => {
        if (state.user?.id === action.meta.arg.userId) {
          state.user.role = action.meta.arg.role;
        }
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addCase(requestPasswordReset.fulfilled, () => {})
      .addCase(resetPassword.fulfilled, () => {});
  },
});

export const { setResetToken, removeResetToken, setError, removeError } =
  authSlice.actions;
export default authSlice.reducer;
