
const initialState = {
    cart: [],
    totalPrice: 0,
    cartId: null,
}
export const CartReducer =  (state = initialState, action) => {
    switch (action.type) {
        case "ADD_CART_UNAUTHENTICATED": {
            const productToAdd = action.payload;
            const existingProduct = state.cart.find(
                (item) => item.productId === productToAdd.productId
            );
            if (existingProduct) {
                const updatedCart = state.cart.map((item) => {
                    if (item.productId === productToAdd.productId) return productToAdd;
                    else return item;
                })
                return {
                    ...state,
                    cart: updatedCart,
                }
            }
            else {
                const newCart = [...state.cart, productToAdd];
                return {
                    ...state,
                    cart: newCart,
                }
            }
        }

        case "ADD_CART_AUTHENTICATED": {
            return {
                ...state, 
                cart: action.payload.products,
            }
        }

        case "REMOVE_CART": {
            return {
                ...state,
                cart: state.cart.filter(
                    (item) => item.productId !== action.payload.productId
                )
            }
        }

        case "REMOVE_ALL_CART": {
            return {
                ...state,
                cart: [],
            }
        }

        default:
            return state;
    }
}