import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/actions";
import { FaExclamationTriangle } from "react-icons/fa";
import ProductCard from "../shared/ProductCard";
import { Link } from "react-router-dom";
import { Header } from "../shared/Header"
import { HeroBanner } from "../home/HeroBanner"
import { Footer } from "../shared/Footer"
import { Loader } from "../shared/Loader"




export const Home = () => {
    const { products } = useSelector((state) => state.products);
    const { isFetchingProducts, fetchingProductsErrorMessage } = useSelector((state) => state.errors);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProducts("sortBy=discount&sortOrder=desc&pageNumber=0&pageSize=4"));
    }, [dispatch]);

    return (
        <div className="bg-gray-50 min-h-screen">

            <Header />

            <HeroBanner />

            {/* Flash Sale Section */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">

                {/* Section title */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
                        Flash Sale 🔥
                    </h2>

                    <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
                        Don't miss our hottest deals! Grab your favorite products with
                        amazing discounts before they're gone.
                    </p>
                </div>

                {/* Content */}
                {
                    isFetchingProducts ? (
                        <Loader />
                    ) : fetchingProductsErrorMessage ? (
                        <div className="flex justify-center items-center gap-4 h-[200px] text-red-500">
                            <FaExclamationTriangle className="text-3xl" />
                            <span className="text-xl font-semibold">
                                {fetchingProductsErrorMessage}
                            </span>
                        </div>
                    ) : (
                        <>
                            {/* Product grid */}
                            <div className="
                                grid 
                                sm:grid-cols-2 
                                lg:grid-cols-4 
                                gap-8
                            ">
                                {
                                    products &&
                                    products.map((item, i) => (
                                        <ProductCard key={i} {...item} />
                                    ))
                                }
                            </div>

                            {/* View more button */}
                            <div className="flex justify-center mt-14">
                                <Link
                                    to="/products"
                                    className="
                                    px-8 py-3
                                    bg-blue-600 
                                    hover:bg-blue-700
                                    text-white 
                                    rounded-full
                                    font-medium
                                    shadow-md
                                    hover:shadow-xl
                                    transition-all
                                    duration-300
                                    "
                                >
                                    View More Products
                                </Link>
                            </div>
                        </>
                    )
                }

            </section>

            {/* Promotion Section */}
            <section className="
                relative
                py-24
                text-white
                text-center
                bg-gradient-to-r 
                from-blue-600 
                via-indigo-600 
                to-purple-600
            ">

                <div className="max-w-3xl mx-auto px-6">

                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Up to 50% Off
                    </h2>

                    <p className="text-lg md:text-xl opacity-90 mb-10">
                        Limited-time deals on our best-selling products.
                        Discover amazing discounts today.
                    </p>

                    <Link
                        to="/products"
                        className="
                        inline-block
                        bg-white
                        text-blue-600
                        px-8
                        py-3
                        rounded-full
                        font-semibold
                        shadow-lg
                        hover:scale-105
                        transition
                        "
                    >
                        Shop Now
                    </Link>

                </div>

            </section>

            <Footer />

        </div>
    );
};