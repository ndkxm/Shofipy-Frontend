import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"
import { fetchProducts } from "../../store/actions";

export const useProductFilter = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        const currentPage = (params.get("pageNumber")) ? (Number(params.get("pageNumber"))) : 1;
        params.set("pageNumber", currentPage - 1);

        const categoryParams = searchParams.get("category") || null;
        const sortOrder = searchParams.get("sortOrder") || "asc";
        const keyword = searchParams.get("keyword") || null;

        params.set("sortBy", "productId"); // Use productId for consistent sorting
        params.set("sortOrder", sortOrder);
        if (categoryParams) {
            params.set("category", categoryParams);
        }
        if (keyword) {
            params.set("keyword", keyword);
        }
        const queryString = params.toString();
        console.log("Query String: " + queryString);
        dispatch(fetchProducts(queryString));
    }, [dispatch, searchParams])
}