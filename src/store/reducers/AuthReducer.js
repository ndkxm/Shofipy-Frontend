
const initialState = {
    user: null,
    accessToken: null,
}
export const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_USER":
            return {
                ...state,
                user: action.payload.userInfoResponse,
                accessToken: action.payload.accessToken
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
                accessToken: action.payload,
            }

        case "LOG_OUT":
            return {
                user: null,
                accessToken: null
            }
        default:
            return state;
    }
}