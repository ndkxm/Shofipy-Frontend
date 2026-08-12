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

export const fetchGenres = () => async (dispatch) => {
    try {
        const { data } = await api.get(`/public/genres`, { params: { pageSize: 200 } });
        dispatch({
            type: "FETCH_GENRES",
            payload: data?.content || data || [],
        });
    } catch (error) {
        console.log("Failed to fetch genres:", error);
    }
};


export const fetchUserCart = () => async (dispatch, getState) => {
    const { user } = getState().auth;
    if (user) {
        try {
            const { data } = await api.get("/carts/users/cart");
            dispatch({
                type: "ADD_CART_AUTHENTICATED",
                payload: data,
            });
        } catch (error) {
            console.log("Failed to fetch user cart:", error);
        }
    }
};

export const addProductToCart = (data) => async (dispatch, getState) => {
    const { user } = getState().auth;
    // Dùng data.productName trực tiếp — không lookup store vì store có thể rỗng khi ở ProductDetail page
    const productName = data?.productName ?? "Product";

    if (!user) {
        const { cart } = getState().carts;

        const existingProduct = cart.find(
            (item) => item.productId === data.productId
        );

        if (!existingProduct) {
            dispatch({
                type: "ADD_CART_UNAUTHENTICATED",
                payload: {
                    ...data,
                    quantity: 1,
                }
            });
            // Lưu sau khi dispatch để state đã update
            setTimeout(() => {
                localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
            }, 0);
            toast.success(`Added "${productName}" to cart!`, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
        } else {
            toast.error("Product already exists in cart", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
        }
    } else {
        try {
            await api.post(`/cart/products/${data.productId}`);
            const res = await api.get("/carts/users/cart");
            dispatch({
                type: "ADD_CART_AUTHENTICATED",
                payload: res.data,
            });
            toast.success(`Added "${productName}" to cart!`, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
        } catch (error) {
            const errData = error.response?.data;
            const errorMessage = errData?.message || errData || "Failed to add to cart";
            toast.error(errorMessage, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
        }
    }
};

// increaseProductInCart and decreaseProductInCart removed
// — each cart item is always quantity 1; use removeProductFromCart to delete


export const removeProductFromCart = (data, cartId) => async (dispatch, getState) => {
    const { user } = getState().auth;
    if (user) {
        await api.delete(`/carts/${cartId}/products/${data.productId}`)
    }
    dispatch({ type: "REMOVE_CART", payload: data });
    
    if (!user) {
        setTimeout(() => {
            localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        }, 0);
    }
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
        const { data } = await api.post("/auth/login", sendData);
        dispatch({
            type: "LOGIN_USER",
            payload: data,
        });

        // Lưu refresh token vào localStorage (cross-origin safe)
        if (data.refreshToken) {
            localStorage.setItem("refreshToken", data.refreshToken);
        }

        const guestCarts = getState().carts;
        if (guestCarts.cart && guestCarts.cart.length > 0) {
            try {
                // BE expects List<MergeCartItemDTO> = [{productId, quantity}]
                const mergePayload = guestCarts.cart.map((item) => ({
                    productId: item.productId,
                    quantity: 1,
                }));
                await api.post(`/carts/merge`, mergePayload);
            } catch (error) {
                console.log("Cart merge failed:", error);
            }
        }

        // Xóa cart local sau khi login/merge xong để dọn dẹp dữ liệu cũ
        localStorage.removeItem("cartItems");

        dispatch(fetchUserCart());

        localStorage.setItem("auth", JSON.stringify(data.userInfoResponse));
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

export const renewAccessToken = () => async (dispatch, getState) => {
    try {
        const refreshToken = getState().auth?.refreshToken
            || localStorage.getItem("refreshToken");

        if (!refreshToken) {
            // Không có refresh token → chưa đăng nhập hoặc đã logout
            return;
        }

        const { data } = await api.post("/auth/refresh", { refreshToken });

        // Lưu rotating refresh token mới
        localStorage.setItem("refreshToken", data.refreshToken);

        dispatch({
            type: "UPDATE_ACCESS_TOKEN",
            payload: { accessToken: data.accessToken, refreshToken: data.refreshToken },
        })
    } catch (error) {
        // Chỉ logout khi server trả về 401/403 (token thực sự invalid/expired)
        // Không logout khi network error hoặc server đang cold start (Render free tier)
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
            dispatch(logOutUser());
        }
        // Nếu không có response (network error, timeout) → giữ nguyên session
    }
}

export const fetchAuthInfo = (sendData) => async (dispatch, getState) => {
    const currentUser = getState().auth.user || {};
    const updatedUser = {
        ...currentUser,
        ...sendData,
    };

    dispatch({
        type: "AUTH_INFO",
        payload: updatedUser,
    });
    localStorage.setItem("auth", JSON.stringify(updatedUser));
}

export const registerNewUser = (sendData, reset, navigate) => async (dispatch) => {
    try {
        await api.post("/auth/register", sendData);
        reset();
        navigate("/signin")
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

export const logOutUser = (navigate) => async (dispatch, getState) => {
    try {
        const refreshToken = getState().auth?.refreshToken
            || localStorage.getItem("refreshToken");
        await api.post("/auth/signout", refreshToken ? { refreshToken } : {});
    } catch (e) {
        console.log("Signout request failed:", e);
    }
    dispatch({ type: "LOG_OUT" });
    localStorage.removeItem("auth");
    localStorage.removeItem("refreshToken");
    dispatch({ type: "REMOVE_ALL_CART" });
    localStorage.removeItem("cartItems");
    if (typeof navigate === "function") {
        navigate("/signin");
    }
}


export const saveSelectedPaymentMethod = (method) => (dispatch) => {
    dispatch({
        type: "SAVE_SELECTED_PAYMENT_METHOD",
        payload: method.id,
    })
}

