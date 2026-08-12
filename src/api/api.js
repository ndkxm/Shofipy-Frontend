import axios from "axios";
import store from "../store/store";
import { logOutUser, renewAccessToken } from "../store/actions";

// Local dev: VITE_BACK_END_URL=http://localhost:8080 → baseURL = http://localhost:8080/api
// Production: VITE_BACK_END_URL="" (empty in Vercel env) → baseURL = /api (dùng Vercel proxy)
const baseURL = import.meta.env.VITE_BACK_END_URL
    ? `${import.meta.env.VITE_BACK_END_URL}/api`
    : "/api";

const api = axios.create({
    baseURL,
    withCredentials: true, // cần thiết để gửi HttpOnly cookie
})

api.interceptors.request.use((config) => {
    const accessToken = store.getState().auth?.accessToken;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/refresh")
        ) {
            originalRequest._retry = true;

            try {
                await store.dispatch(renewAccessToken());

                const newAccessToken = store.getState().auth.accessToken;

                if (!newAccessToken) {
                    store.dispatch(logOutUser());
                    return Promise.reject(error);
                }

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (e) {
                // Chỉ logout khi có lỗi từ server (không phải network error / cold start)
                if (e?.response?.status) {
                    store.dispatch(logOutUser());
                }
                return Promise.reject(e);
            }
        }

        return Promise.reject(error);
    }
);

export default api;