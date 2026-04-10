import { FaExclamationTriangle } from "react-icons/fa";
import { ProductCard } from "../shared/ProductCard";
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
import { motion } from "framer-motion";

export const Products = () => {
    const { isFetchingProducts, fetchingProductsErrorMessage } = useSelector((state) => state.errors);
    const { products, categories, paginations } = useSelector((state) => state.products);
    const dispatch = useDispatch();
    useProductFilter();

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className="max-w-[1500px] mx-auto">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:wght@400;500;600;700&display=swap');
                .products-wrap { font-family: 'Reddit Sans', sans-serif; }
            `}</style>

            <Header />

            <div className="products-wrap lg:px-14 sm:px-8 px-4 py-14 2xl:w-[90%] 2xl:mx-auto mt-22">

                <Filter categories={categories} />

                {isFetchingProducts ? (
                    <Loader />
                ) : fetchingProductsErrorMessage ? (
                    <div className="flex justify-center items-center py-24">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center bg-white border border-red-100 rounded-3xl px-10 py-12 max-w-md text-center"
                            style={{ boxShadow: "0 4px 32px rgba(239,68,68,0.08)" }}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-5">
                                <FaExclamationTriangle className="text-red-400 text-2xl" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2 tracking-tight">
                                Something went wrong
                            </h3>
                            <p className="text-sm text-slate-400 mb-7 leading-relaxed">
                                {fetchingProductsErrorMessage}
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                                style={{ boxShadow: "0 4px 14px rgba(15,23,42,0.18)" }}
                            >
                                <FiRefreshCcw className="text-xs" />
                                Try Again
                            </button>
                        </motion.div>
                    </div>
                ) : (
                    <div className="min-h-[700px]">
                        <div className="pb-6 pt-10 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-y-6 gap-x-6">
                            {products && products.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.28, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <ProductCard {...item} />
                                </motion.div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center pt-25 h-full">
                            <Paginations
                                numberOfPage={paginations?.totalPages}
                                totalProducts={paginations?.totalElements}
                            />
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};