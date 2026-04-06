import { configureStore } from "@reduxjs/toolkit";
import { ProductReducer } from "./reducers/ProductReducer";
import { ErrorProducer } from "./reducers/ErrorReducer";
import { CartReducer } from "./reducers/CartReducer";
import { AuthReducer } from "./reducers/AuthReducer";
import { PaymentMethodReducer } from "./reducers/PaymentMethodReducer";

const user = localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")) : null;

const initialState = {
    carts: { cart: [], cartId: null, totalPrice: 0 },
    auth: { user: user }
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