import { FaExclamationTriangle } from "react-icons/fa";
import ProductCard from "../shared/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCategories, fetchProducts } from "../../store/actions";
import { Loader } from "../shared/Loader";
import { Filter } from "./Filter";
import { useProductFilter } from "../hooks/useProductFilter";
import { Paginations } from "../shared/Paginations";
import { Header } from "../shared/Header";
import { Footer } from "../shared/Footer";
import { FiRefreshCcw } from "react-icons/fi";

export const Products = () => {
    const { isFetchingProducts, fetchingProductsErrorMessage } = useSelector((state) => state.errors);
    const { products, categories, paginations } = useSelector((state) => state.products)
    const dispatch = useDispatch();
    useProductFilter();
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);
    return (
        <div className="max-w-[1500px] mx-auto">
            <Header />
            <div className="lg:px-14 sm:px-8 px-4 py-14 2xl:w-[90%] 2xl:mx-auto mt-22">
                <Filter categories={categories} />
                {
                    isFetchingProducts ? (
                        <Loader />
                    ) : fetchingProductsErrorMessage ? (
                        <div className="flex justify-center items-center py-24">

                            <div className="
                                flex flex-col items-center
                                bg-white
                                border border-gray-200
                                shadow-sm
                                rounded-2xl
                                px-10 py-12
                                max-w-md
                                text-center
                            ">

                                <FaExclamationTriangle className="text-red-500 text-5xl mb-4" />

                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Something went wrong
                                </h3>

                                <p className="text-gray-500 mb-6">
                                    {fetchingProductsErrorMessage}
                                </p>

                                <button
                                    onClick={() => window.location.reload()}
                                    className="
                                        flex items-center gap-2
                                        bg-blue-600
                                        hover:bg-blue-700
                                        text-white
                                        px-5 py-2
                                        rounded-full
                                        text-sm
                                        transition
                                        "
                                >
                                    <FiRefreshCcw />
                                    Try Again
                                </button>

                            </div>

                        </div>
                    ) : (
                        <div className="min-h-[700px]">
                            <div className="pb-6 pt-14 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-y-6 gap-x-6">
                                {
                                    products && products.map((item, i) => <ProductCard key={i} {...item} />)
                                }
                            </div>
                            <div className="flex items-center justify-center pt-25 h-full">
                                <Paginations
                                    numberOfPage={paginations?.totalPages}
                                    totalProducts={paginations?.totalElements}
                                />
                            </div>
                        </div>
                    )
                }
            </div>
            <Footer />
        </div>
    )
}