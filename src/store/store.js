import { configureStore } from "@reduxjs/toolkit";
import { ProductReducer } from "./reducers/ProductReducer";
import { ErrorProducer } from "./reducers/ErrorReducer";
import { CartReducer } from "./reducers/CartReducer";
import { AuthReducer } from "./reducers/AuthReducer";
import api from "../api/api";

const user = localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")) : null;
let cartItemsData = [];
if (user) {
    const cartItems = await api.get("/carts/users/cart");
    if (cartItems) {
        cartItemsData = cartItems.data;
    }
}


const initialState = {
    carts: { cart: cartItemsData.products, cartId: cartItemsData.cartId, totalPrice: cartItemsData.totalPrice },
    auth: { user: user }
}

const store = configureStore({
    reducer: {
        products: ProductReducer,
        errors: ErrorProducer,
        carts: CartReducer,
        auth: AuthReducer,
    },
    preloadedState: initialState,
})

export default store;