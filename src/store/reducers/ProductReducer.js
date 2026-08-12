const initialState = {
    products: [],
    categories: [],
    genres: [],
    paginations: {}
}

export const ProductReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_PRODUCTS":
            return {
                ...state,
                products: action.payload,
                paginations: {
                    ...state.pagination,
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                }
            };
        case "FETCH_CATEGORIES":
            return {
                ...state,
                categories: action.payload,
                paginations: {
                    ...state.pagination,
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                }
            };
        case "FETCH_GENRES":
            return {
                ...state,
                genres: action.payload,
            };
        default:
            return state;
    }
}
