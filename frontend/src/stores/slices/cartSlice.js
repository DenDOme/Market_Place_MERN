import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

const initialState = {
  cartItems: [],
  totalPrice: 0,
  loading: false,
  error: null,
};

const orderUrl = import.meta.env.VITE_API_URL + "/cart";

const calcTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`${orderUrl}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch cart");
    }
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async (itemId, { dispatch, rejectWithValue }) => {
    try {
      await API.post(`${orderUrl}/${itemId}`, {});
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to add item to cart"
      );
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItem",
  async (itemId, { dispatch, rejectWithValue }) => {
    try {
      await API.delete(`${orderUrl}/${itemId}`);
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to remove item from cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        const items = action.payload.cart.items ?? [];
        state.cartItems = items;
        state.totalPrice = calcTotal(items);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeItemFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;