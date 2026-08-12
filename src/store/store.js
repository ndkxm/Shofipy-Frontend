import { configureStore } from "@reduxjs/toolkit";
import { ProductReducer } from "./reducers/ProductReducer";
import { ErrorProducer } from "./reducers/ErrorReducer";
import { CartReducer } from "./reducers/CartReducer";
import { AuthReducer } from "./reducers/AuthReducer";
import { PaymentMethodReducer } from "./reducers/PaymentMethodReducer";

const user = localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")) : null;
const refreshToken = localStorage.getItem("refreshToken") || null;
const cartItems = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];
const totalPrice = cartItems.reduce(
    (acc, item) => acc + (Number(item?.specialPrice ?? item?.price ?? 0) * Number(item?.quantity ?? 0)),
    0
);

const initialState = {
    carts: { cart: cartItems, cartId: null, totalPrice: totalPrice },
    auth: { user: user, accessToken: null, refreshToken: refreshToken }
}

const store = configureStore({
    reducer: {
        products: ProductReducer,
        errors: ErrorProducer,
        carts: CartReducer,
        auth: AuthReducer,
        payment: PaymentMethodReducer
    },
    preloadedState: initialState,
})

export default store;