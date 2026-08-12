const initialState = {
    isFetchingProducts: false,
    fetchingProductsErrorMessage: null,
    isFetchingCategories: false,
    fetchingCategoriesErrorMessage: null,
}

export const ErrorProducer = (state = initialState, action) => {
    switch (action.type) {
        case "IS_FETCHING_PRODUCTS":
            return {
                ...state,
                isFetchingProducts: true,
                fetchingProductsErrorMessage: null,
            };
        case "FETCH_PRODUCTS_SUCCESS":
            return {
                ...state,
                isFetchingProducts: false,
                fetchingProductsErrorMessage: null,
            };
        case "FETCH_PRODUCTS_ERROR":
            return {
                ...state,
                isFetchingProducts: false,
                fetchingProductsErrorMessage: action.payload,
            };
        case "IS_FETCHING_CATEGORIES":
            return {
                ...state,
                isFetchingCategories: true,
                fetchingCategoriesErrorMessage: null,
            };
        case "FETCH_CATEGORIES_SUCCESS":
            return {
                ...state,
                isFetchingCategories: false,
                fetchingCategoriesErrorMessage: null,
            };
        case "FETCH_CATEGORIES_ERROR":
            return {
                ...state,
                isFetchingCategories: false,
                fetchingCategoriesErrorMessage: action.payload,
            };
        default:
            return state;
    }
}