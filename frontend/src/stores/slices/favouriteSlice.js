import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

const initialState = {
  favourites: [],
  loading: false,
  error: null,
};

const productUrl = import.meta.env.VITE_API_URL + "/favourite";

export const fetchFavourites = createAsyncThunk(
  "favourites/fetchFavourites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`${productUrl}/favourites`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch favourites"
      );
    }
  }
);

export const createFavourite = createAsyncThunk(
  "favourites/createFavourite",
  async (favouriteData, { rejectWithValue }) => {
    try {
      const response = await API.post(`${productUrl}/`, favouriteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create favourite"
      );
    }
  }
);

export const deleteFavourite = createAsyncThunk(
  "favourites/deleteFavourite",
  async (favouriteId, { rejectWithValue }) => {
    try {
      await API.delete(`${productUrl}/${favouriteId}`);
      return favouriteId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete favourite"
      );
    }
  }
);

const favouriteSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavourites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.favourites = action.payload.favourites;
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createFavourite.fulfilled, (state, action) => {
        state.favourites.push(action.payload);
      })
      .addCase(deleteFavourite.fulfilled, (state, action) => {
        state.favourites = state.favourites.filter(
          (favourite) => favourite.id !== action.payload
        );
      });
  },
});

export default favouriteSlice.reducer;
