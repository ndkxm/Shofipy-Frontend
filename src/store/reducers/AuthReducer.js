const initialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
}
export const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_USER":
            return {
                ...state,
                user: action.payload.userInfoResponse,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
            }

        case "AUTH_INFO":
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload,
                },
            }

        case "UPDATE_ACCESS_TOKEN":
            return {
                ...state,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
            }

        case "LOG_OUT":
            return {
                user: null,
                accessToken: null,
                refreshToken: null,
            }
        default:
            return state;
    }
}