import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, Gamepad2, CreditCard, KeyRound } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { fetchProducts } from "../../store/actions";
import { ProductCard } from "../shared/ProductCard";
import { Header } from "../shared/Header";
import { HeroBanner } from "../home/HeroBanner";
import { Footer } from "../shared/Footer";
import { Loader } from "../shared/Loader";
import { EASE, Magnetic, Marquee, Reveal, SplitReveal } from "../shared/Motion";

const STEPS = [
    { n: "01", icon: Gamepad2, title: "Pick a game", body: "Browse by genre or price. Every page shows platform and stock up front.", bg: "var(--color-mustard)" },
    { n: "02", icon: CreditCard, title: "Pay once", body: "Card checkout through Stripe. No accounts to link, no subscriptions.", bg: "var(--color-lilac)" },
    { n: "03", icon: KeyRound, title: "Reveal & redeem", body: "Your key lands in My Orders. Reveal it, paste into Steam, start the download.", bg: "var(--color-moss-soft)" },
];

const TICKER = ["Instant delivery", "Steam keys", "Up to 50% off", "New deals weekly", "Secure Stripe checkout", "Indie to AAA"];

const HowItWorks = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 50%"] });
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

    return (
        <section ref={ref} className="border-y border-slate-900 bg-white">
            <div className="max-w-7xl mx-auto px-5 md:px-6 py-20 grid lg:grid-cols-[1fr_2fr] gap-12">
                <div>
                    <SplitReveal as="h2" lines={["Three steps,", "no shipping."]} className="text-4xl md:text-5xl font-extrabold text-slate-900" />
                    {/* scroll-linked progress rail */}
                    <div className="mt-8 h-2 w-full max-w-xs rounded-full border border-slate-900 overflow-hidden bg-slate-100" aria-hidden="true">
                        <motion.div className="h-full origin-left" style={{ scaleX: progress, background: "linear-gradient(90deg, var(--color-mustard), var(--color-blue-600), var(--color-cobalt))" }} />
                    </div>
                </div>
                <ol className="grid md:grid-cols-3 gap-5">
                    {STEPS.map((s, i) => (
                        <motion.li
                            key={s.n}
                            initial={{ opacity: 0, y: 40, rotate: i % 2 ? 3 : -3 }}
                            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7, delay: i * 0.15, ease: EASE }}
                            whileHover={{ y: -6, rotate: i % 2 ? 1.5 : -1.5 }}
                            className="relative rounded-lg border border-slate-900 p-6"
                            style={{ background: s.bg, boxShadow: "5px 5px 0 0 var(--color-slate-900)" }}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-sm text-slate-900">{s.n}</span>
                                <motion.span
                                    className="grid place-items-center w-10 h-10 rounded-full bg-white border border-slate-900"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <s.icon size={18} aria-hidden="true" />
                                </motion.span>
                            </div>
                            <h3 className="mt-10 text-xl font-extrabold text-slate-900">{s.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-800">{s.body}</p>
                        </motion.li>
                    ))}
                </ol>
            </div>
        </section>
    );
};

const ClosingCta = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const x = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
    const rotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);

    return (
        <section ref={ref} className="max-w-7xl mx-auto px-5 md:px-6 pt-24">
            <Reveal>
                <div
                    className="relative overflow-hidden rounded-lg border border-slate-900 bg-blue-600 text-white px-6 md:px-12 py-16 md:py-20 grid md:grid-cols-[1fr_auto] items-end gap-8"
                    style={{ boxShadow: "8px 8px 0 0 var(--color-slate-900)" }}
                >
                    {/* moving diagonal stripes */}
                    <motion.div
                        aria-hidden="true"
                        className="absolute -inset-20 opacity-20"
                        style={{
                            x, rotate,
                            backgroundImage: "repeating-linear-gradient(-45deg, var(--color-mustard) 0 18px, transparent 18px 46px)",
                        }}
                    />
                    <motion.div
                        aria-hidden="true"
                        className="absolute -right-10 -top-10 w-48 h-48 rounded-full border border-slate-900"
                        style={{ background: "var(--color-mustard)" }}
                        animate={{ scale: [1, 1.08, 1], rotate: [0, 20, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="relative">
                        <p className="label-mono text-blue-100 mb-4">Up to 50% off this week</p>
                        <SplitReveal as="h2" lines={["Your backlog", "called."]} className="display text-5xl md:text-7xl" />
                    </div>
                    <Magnetic className="relative">
                        <Link to="/products" className="inline-flex items-center gap-2 bg-slate-900 text-slate-50 border border-slate-900 rounded-md px-7 py-4 font-bold text-[15px] hover:bg-white hover:text-slate-900 transition-colors">
                            Shop the sale <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </Magnetic>
                </div>
            </Reveal>
        </section>
    );
};

export const Home = () => {
    const { products } = useSelector((state) => state.products);
    const { isFetchingProducts, fetchingProductsErrorMessage } = useSelector((state) => state.errors);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProducts("sortBy=discount&sortOrder=desc&pageNumber=0&pageSize=12"));
    }, [dispatch]);

    const featured = products?.[0];

    return (
        <div className="bg-slate-50 min-h-screen overflow-x-hidden">
            <Header />
            <HeroBanner featured={featured} loading={isFetchingProducts} />

            {/* Crossed ticker tapes */}
            <div className="relative py-10 bg-slate-50" aria-label="Highlights">
                <Marquee
                    items={TICKER}
                    speed={32}
                    className="relative z-10 -rotate-2 bg-blue-600 text-white border-y border-slate-900 py-3 display text-2xl md:text-3xl"
                />
                <Marquee
                    items={TICKER}
                    speed={40}
                    reverse
                    separator="●"
                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 rotate-2 bg-[var(--color-mustard)] text-slate-900 border-y border-slate-900 py-2 label-mono !text-sm"
                />
            </div>

            <main>
                {/* Deals */}
                <section className="max-w-7xl mx-auto px-5 md:px-6 py-16">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 pb-5 border-b border-slate-900">
                        <div>
                            <Reveal as="p" className="label-mono text-slate-500 mb-3">Sorted by discount</Reveal>
                            <SplitReveal as="h2" lines={["Biggest price drops"]} className="text-4xl md:text-5xl font-extrabold text-slate-900" />
                        </div>
                        <Link to="/products" className="group inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600">
                            All games <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </Link>
                    </div>

                    {isFetchingProducts ? (
                        <Loader text="Loading deals" />
                    ) : fetchingProductsErrorMessage ? (
                        <div className="panel max-w-md mx-auto p-8 text-center" role="alert">
                            <AlertTriangle className="mx-auto text-blue-600 mb-3" size={24} aria-hidden="true" />
                            <p className="font-bold text-slate-900">Couldn’t load games</p>
                            <p className="mt-1 text-sm text-slate-500">{fetchingProductsErrorMessage}</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products?.map((item, i) => (
                                <Reveal key={item.productId} delay={(i % 4) * 0.08} className="h-full">
                                    <ProductCard {...item} index={i} />
                                </Reveal>
                            ))}
                        </div>
                    )}
                </section>

                <HowItWorks />
                <ClosingCta />
            </main>

            <Footer />
        </div>
    );
};
