import { Tuple } from "@reduxjs/toolkit";
import api from "../../api/api";
import { Bounce, toast } from "react-toastify";
import { useSelector } from "react-redux";


export const fetchProducts = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING_PRODUCTS" });
        const { data } = await api.get(`/public/products?${queryString}`);
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "FETCH_PRODUCTS_SUCCESS" });
    } catch (error) {
        dispatch({
            type: "FETCH_PRODUCTS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch products"
        })
    }
};

export const fetchCategories = () => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING_CATEGORIES" });
        const { data } = await api.get(`/public/categories`);
        dispatch({
            type: "FETCH_CATEGORIES",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "FETCH_CATEGORIES_SUCCESS" });
    } catch (error) {
        dispatch({
            type: "FETCH_CATEGORIES_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch categories"
        })
    }
};

export const fetchUserCart = () => async (dispatch) => {
    try {
        const { data } = await api.get("/carts/users/cart");
        dispatch({
            type: "ADD_CART_AUTHENTICATED",
            payload: data,
        });
    } catch (error) {
        console.log("Failed to fetch user cart:", error);
    }
};

export const addProductToCart = (data, quantity) => async (dispatch, getState) => {
    const { products } = getState().products;
    const { user } = getState().auth;
    const getProduct = products.find(
        (item) => item.productId === data.productId
    )
    if (!user) {
        const { cart } = getState().carts;

        const existingProduct = cart.find(
            (item) => item.productId === data.productId
        )

        if (!existingProduct) {
            dispatch({
                type: "ADD_CART_UNAUTHENTICATED",
                payload: {
                    ...data,
                    quantity: quantity,
                }
            });
            toast.success(`Added ${getProduct.productName} to cart successfully!`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        }
        else {
            toast.error("Product already exist in cart", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    }
    else {
        try {
            await api.post(`/cart/products/${data.productId}/quantity/1`);
            // Fetch cart AFTER adding the product
            const res = await api.get("/carts/users/cart");
            const usersCartFromDatabase = res.data;
            dispatch({
                type: "ADD_CART_AUTHENTICATED",
                payload: usersCartFromDatabase
            });
            toast.success(`Added ${getProduct.productName} to cart successfully!`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        } catch (error) {
            const data = error.response?.data
            let errorMessage;
            if (data?.message) {
                errorMessage = data.message;
            } else {
                errorMessage = data;
            }
            toast.error(errorMessage, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    }
};

export const increaseProductInCart = (data, currentQuantity, setCurrentQuantity) => (dispatch, getState) => {

    try {
        const newQuantity = currentQuantity + 1;
        setCurrentQuantity(newQuantity);

        dispatch({
            type: "ADD_CART",
            payload: {
                ...data,
                quantity: newQuantity,
            }
        });
    } catch (error) {
        toast.error(error?.message || `Out of stocks!`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    }

}

export const decreaseProductInCart = (data, currentQuantity, setCurrentQuantity) => (dispatch, getState) => {
    if (currentQuantity > 1) {
        const newQuantity = currentQuantity - 1;
        setCurrentQuantity(newQuantity);
        dispatch({
            type: "ADD_CART",
            payload: {
                ...data,
                quantity: newQuantity,
            }
        });
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
    }
}

export const removeProductFromCart = (data, cartId) => async (dispatch) => {
    await api.delete(`/carts/${cartId}/products/${data.productId}`)
    dispatch({ type: "REMOVE_CART", payload: data });
    toast.success(`${data.productName} removed from cart!`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
}

export const authenticatedSignInUser = (sendData, reset, navigate) => async (dispatch, getState) => {
    try {
        const guestCarts = getState().carts;
        if (guestCarts.cart) {
            try {
                await api.post(`/carts/${guestCarts.cartId}/merge`, guestCarts.cart);
            } catch (error) {
                console.log(error);
            }
        }

        const { data } = await api.post("/auth/login", sendData);
        dispatch({
            type: "LOGIN_USER",
            payload: data,
        });

        dispatch(fetchUserCart());

        localStorage.setItem("auth", JSON.stringify(data));
        reset();
        navigate("/")
        toast.success(`Login successfully!`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    }
}

export const registerNewUser = (sendData, reset, navigate) => async (dispatch) => {
    try {
        await api.post("/auth/register", sendData);
        reset();
        navigate("/login")
        toast.success(`Register successfully! Please login`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    }
}

export const logOutUser = (navigate) => async (dispatch) => {
    try {
        await api.post("/auth/signout"); // clears the HttpOnly JWT cookie server-side
    } catch (e) {
        console.log("Signout request failed:", e);
    }
    dispatch({ type: "LOG_OUT" });
    localStorage.removeItem("auth");
    dispatch({ type: "REMOVE_ALL_CART" });
    localStorage.removeItem("cartItems");
    navigate("/");
}

export const addNewAddress = (sendData) => async (dispatch) => {
    try {
        await api.post("/addresses", sendData);
        dispatch(fetchAddresses());
        toast.success(`Add new address successfully`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });

    } catch (error) {
        toast.error(error?.response?.data?.message || "Internal Server Error", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    }
}

export const fetchAddresses = () => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING_ADDRESSES" });
        const { data } = await api.get(`/addresses`);
        dispatch({
            type: "FETCH_ADDRESSES",
            payload: data,
        });
        dispatch({ type: "FETCH_ADDRESSES_SUCCESS" });
    } catch (error) {
        dispatch({
            type: "FETCH_ADDRESSES_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch addresses"
        })
    }
};

export const saveSelectedAddress = (address) => (dispatch) => {
    dispatch({
        type: "SAVE_CHECKOUT_ADDRESS",
        payload: address,
    })
}

export const updateAddress = (sendData, address) => async (dispatch) => {
    try {
        await api.put(`/addresses/${address.addressId}`, sendData);
        dispatch(fetchAddresses());
        toast.success(`Update address successfully`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });

    } catch (error) {
        toast.error(error?.response?.data?.message || "Internal Server Error", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    }
}


export const deleteAddress = (address) => async (dispatch) => {
    try {
        await api.delete(`/addresses/${address.addressId}`);
        dispatch(fetchAddresses());
        toast.success(`Delete address successfully`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });

    } catch (error) {
        toast.error(error?.response?.data?.message || "Internal Server Error", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    }
}

export const saveSelectedPaymentMethod = (method) => (dispatch) => {
    dispatch({
        type: "SAVE_SELECTED_PAYMENT_METHOD",
        payload: method,
    })
}