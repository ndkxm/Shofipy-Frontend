import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Header } from "../shared/Header";
import { Footer } from "../shared/Footer";
import { CartItem } from "./CartItem";
import { CheckOut } from "./CartInfo";
import { SplitReveal } from "../shared/Motion";
import { motion } from "framer-motion";

export const Cart = () => {
    const { cart } = useSelector((state) => state.carts);

    const totalPrice = cart?.reduce(
        (acc, cur) => acc + Number(cur?.specialPrice || cur?.price),
        0
    ) || 0;

    const summary = {
        subtotal: totalPrice,
        total: totalPrice,
        shipping: 0,
        discount: 0,
    };

    const count = cart?.length || 0;

    return (
        <div className="bg-slate-50 min-h-screen">
            <Header />

            <main className="pt-16">
                <section className="border-b border-slate-900">
                    <div className="max-w-7xl mx-auto px-5 md:px-6 pt-12 pb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <p className="label-mono text-slate-500 mb-3">
                                {count > 0 ? `${count} item${count > 1 ? "s" : ""}` : "Empty"}
                            </p>
                            <SplitReveal lines={["Cart"]} className="display text-6xl md:text-8xl text-slate-900" />
                        </div>
                        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600">
                            <ArrowLeft size={16} aria-hidden="true" /> Keep shopping
                        </Link>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-5 md:px-6 py-10">
                    {count > 0 ? (
                        <div className="grid lg:grid-cols-[1fr_22rem] gap-8 items-start">
                            <ul className="border-t border-slate-900">
                                <AnimatePresence>
                                    {cart.map((item) => (
                                        <CartItem key={item.productId} product={item} />
                                    ))}
                                </AnimatePresence>
                            </ul>
                            <CheckOut summary={summary} />
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center text-center">
                            <motion.div
                                className="grid place-items-center w-24 h-24 mb-6 rounded-lg border border-slate-900"
                                style={{ background: "var(--color-mustard)", boxShadow: "5px 5px 0 0 var(--color-slate-900)" }}
                                animate={{ rotate: [-6, 6, -6], y: [0, -8, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                                aria-hidden="true"
                            >
                                <ShoppingCart size={40} strokeWidth={1.5} className="text-slate-900" />
                            </motion.div>
                            <p className="text-3xl font-extrabold text-slate-900">Nothing in here yet.</p>
                            <p className="mt-2 text-slate-500">Find a game and it’ll wait for you here.</p>
                            <Link to="/products" className="btn-accent mt-8">Browse games</Link>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};
