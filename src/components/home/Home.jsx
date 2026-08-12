import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/actions";
import { FaExclamationTriangle } from "react-icons/fa";
import { ProductCard } from "../shared/ProductCard";
import { Link } from "react-router-dom";
import { Header } from "../shared/Header";
import { HeroBanner } from "../home/HeroBanner";
import { Footer } from "../shared/Footer";
import { Loader } from "../shared/Loader";
import { motion } from "framer-motion";

export const Home = () => {
    const { products } = useSelector((state) => state.products);
    const { isFetchingProducts, fetchingProductsErrorMessage } = useSelector((state) => state.errors);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProducts("sortBy=discount&sortOrder=desc&pageNumber=0&pageSize=12"));
    }, [dispatch]);

    return (
        <div className="bg-slate-50 min-h-screen">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:wght@400;500;600;700;800&display=swap');
                .home-wrap { font-family: 'Reddit Sans', sans-serif; }
            `}</style>

            <Header />
            <HeroBanner />

            {/* Hot Deals Section */}
            <section className="home-wrap max-w-7xl mx-auto px-6 lg:px-8 py-20">

                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
                >
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Hot Deals 🔥
                        </h2>
                        <p className="mt-2 text-slate-400 text-sm max-w-md leading-relaxed">
                            Grab your favorite products with amazing discounts.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-all duration-150"
                        style={{ boxShadow: "0 2px 10px rgba(15,23,42,0.15)" }}
                    >
                        View All
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </Link>
                </motion.div>

                {/* Products */}
                {isFetchingProducts ? (
                    <Loader />
                ) : fetchingProductsErrorMessage ? (
                    <div className="flex justify-center items-center py-16">
                        <div
                            className="flex flex-col items-center bg-white border border-red-100 rounded-3xl px-10 py-12 max-w-sm text-center"
                            style={{ boxShadow: "0 4px 24px rgba(239,68,68,0.08)" }}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
                                <FaExclamationTriangle className="text-red-400 text-xl" />
                            </div>
                            <p className="text-sm font-semibold text-slate-700 mb-1">Something went wrong</p>
                            <p className="text-xs text-slate-400">{fetchingProductsErrorMessage}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products && products.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <ProductCard {...item} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Promo banner */}
            <section className="home-wrap relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-slate-900" />
                <div className="absolute inset-0 opacity-30"
                    style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 45%)" }}
                />
                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
                />

                <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Special Offer</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                            Up to <span className="text-blue-400">50% Off</span>
                        </h2>

                        <p className="text-base text-white/60 mb-10 leading-relaxed max-w-lg mx-auto">
                            Limited-time deals on our best-selling products. Discover amazing discounts today.
                        </p>

                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-blue-50 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-150"
                            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
                        >
                            Shop Now
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};