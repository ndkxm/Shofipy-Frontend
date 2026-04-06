import { act } from "react"

const initialState = {
    user: null,
    addresses: [],
    selectedCheckoutAddress: null
}
export const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_USER":
            return {
                ...state,
                user: action.payload,
            }

        case "FETCH_ADDRESSES":
            return {
                ...state,
                addresses: action.payload,
            }
        case "SAVE_CHECKOUT_ADDRESS":
            return {
                ...state,
                selectedCheckoutAddress: action.payload,
            }
        case "DELETE_ADDRESS": {
            const isSelectedAddress = state.selectedCheckoutAddress?.addressId === action.payload.addressId;
            return {
                ...state,
                addresses: state.addresses.filter(addr => addr.addressId !== action.payload.addressId),
                selectedCheckoutAddress: isSelectedAddress ? null : state.selectedCheckoutAddress
            }
        }
        case "LOG_OUT":
            return {
                user: null,
                addresses: null
            }
        default:
            return state;
    }
}