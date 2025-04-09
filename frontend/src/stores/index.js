import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import orderReducer from "./slices/orderSlice";
import cartReducer from "./slices/cartSlice";
import categoryReducer from "./slices/categorySlice";
import favouriteReducer from "./slices/favouriteSlice";
import reviewReducer from "./slices/reviewSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    carts: cartReducer,
    categories: categoryReducer,
    favourites: favouriteReducer,
    reviews: reviewReducer,
  },
});

export default store;
