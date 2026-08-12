const calculateTotalPrice = (cart = []) =>
    cart.reduce(
        (acc, item) => acc + (Number(item?.specialPrice ?? item?.price ?? 0) * Number(item?.quantity ?? 0)),
        0
    );

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
                    totalPrice: calculateTotalPrice(updatedCart),
                }
            }
            else {
                const newCart = [...state.cart, productToAdd];
                return {
                    ...state,
                    cart: newCart,
                    totalPrice: calculateTotalPrice(newCart),
                }
            }
        }

        case "ADD_CART_AUTHENTICATED": {
            return {
                ...state, 
                cart: action.payload.products,
                cartId: action.payload.cartId,
                totalPrice: Number(action.payload.totalPrice || 0),
            }
        }

        case "FETCH_CART_UNAUTHENTICATED": {
            return {
                ...state, 
                cart: action.payload.products,
                totalPrice: Number(action.payload.totalPrice || 0),
            }
        }

        case "REMOVE_CART": {
            const updatedCart = state.cart.filter(
                (item) => item.productId !== action.payload.productId
            );
            return {
                ...state,
                cart: updatedCart,
                totalPrice: calculateTotalPrice(updatedCart),
            }
        }

        case "REMOVE_ALL_CART": {
            return {
                ...state,
                cart: [],
                totalPrice: 0,
            }
        }

        default:
            return state;
    }
}
