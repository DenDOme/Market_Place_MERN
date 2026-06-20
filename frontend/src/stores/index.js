import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import orderReducer from "./slices/orderSlice";
import categoryReducer from "./slices/categorySlice";
import favouriteReducer from "./slices/favouriteSlice";
import reviewReducer from "./slices/reviewSlice";
import cartReducer from "./slices/cartSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    categories: categoryReducer,
    favourites: favouriteReducer,
    reviews: reviewReducer,
    carts: cartReducer,
  },
});

export default store;
