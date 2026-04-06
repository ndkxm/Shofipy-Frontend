import { Header } from "../shared/Header";
import { Link } from "react-router-dom";
import { CartItem } from "./CartItem";
import { Footer } from "../shared/Footer";
import { useSelector } from "react-redux";
import { CheckOut } from "./CartInfo";
import { motion, AnimatePresence } from "framer-motion";

const EmptyCartIcon = () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

export const Cart = () => {
    const { cart } = useSelector((state) => state.carts);

    const totalPrice = cart?.reduce(
        (acc, cur) => acc + (Number(cur?.specialPrice || cur?.price) * Number(cur?.quantity)),
        0
    ) || 0;

    const summary = {
        subtotal: totalPrice,
        total: totalPrice,
        shipping: 0,
        discount: 0,
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:wght@400;500;600;700;800&display=swap');
                .cart-wrap { font-family: 'Reddit Sans', sans-serif; }
            `}</style>

            <Header />

            <div className="cart-wrap max-w-7xl mx-auto px-4 lg:px-6 pt-28 lg:pt-36 pb-20">

                {/* Page header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Your Basket
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">
                            {cart?.length > 0
                                ? `${cart.length} item${cart.length > 1 ? "s" : ""} in your cart`
                                : "Your cart is empty"}
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all duration-150"
                    >
                        <ArrowLeftIcon />
                        Continue Shopping
                    </Link>
                </div>

                {/* Content */}
                {cart && cart.length > 0 ? (
                    <div className="grid lg:grid-cols-3 gap-6 items-start">

                        {/* Cart items */}
                        <div className="lg:col-span-2 space-y-3">
                            <AnimatePresence>
                                {cart.map((item) => (
                                    <CartItem key={item.productId} product={item} />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Summary sidebar */}
                        <div className="lg:col-span-1">
                            <CheckOut summary={summary} />
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center py-24 gap-5"
                    >
                        <div className="w-24 h-24 rounded-3xl bg-white border border-slate-200 flex items-center justify-center">
                            <EmptyCartIcon />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-slate-700 mb-1">Your basket is empty</p>
                            <p className="text-sm text-slate-400">Looks like you haven't added anything yet.</p>
                        </div>
                        <Link
                            to="/products"
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-all duration-150"
                            style={{ boxShadow: "0 2px 10px rgba(15,23,42,0.15)" }}
                        >
                            <ArrowLeftIcon />
                            Browse Products
                        </Link>
                    </motion.div>
                )}
            </div>

            <Footer />
        </div>
    );
};