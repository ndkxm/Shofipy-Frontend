import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, ShieldCheck, Library } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { parseImages } from "../utils/ParseImages";
import { EASE, Magnetic, SplitReveal, Sticker, Tilt } from "../shared/Motion";

const FACTS = [
    { icon: Zap, label: "Key in your inbox", sub: "seconds after payment", bg: "var(--color-mustard)" },
    { icon: ShieldCheck, label: "Secure checkout", sub: "card payments via Stripe", bg: "var(--color-cobalt-soft)" },
    { icon: Library, label: "Your library", sub: "every key saved in My Orders", bg: "var(--color-moss-soft)" },
];

const WORDS = [
    { text: "tonight.", bg: "var(--color-mustard)" },
    { text: "this weekend.", bg: "var(--color-lilac)" },
    { text: "right now.", bg: "var(--color-cobalt)", fg: "#fff" },
    { text: "before bed.", bg: "var(--color-moss)", fg: "#fff" },
];

// Rotating word with a colour block that morphs between words.
const RotatingWord = () => {
    const reduce = useReducedMotion();
    const [i, setI] = useState(0);
    useEffect(() => {
        if (reduce) return;
        const t = setInterval(() => setI((n) => (n + 1) % WORDS.length), 2400);
        return () => clearInterval(t);
    }, [reduce]);
    const w = WORDS[i];
    return (
        <span className="relative inline-flex align-bottom">
            <motion.span
                layout
                className="absolute -inset-x-2 inset-y-1 rounded-md border border-slate-900 -z-0"
                animate={{ backgroundColor: w.bg }}
                transition={{ duration: 0.5, ease: EASE }}
                aria-hidden="true"
            />
            <span className="relative overflow-hidden inline-flex px-1">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                        key={w.text}
                        initial={{ y: "100%", rotateX: -80, opacity: 0 }}
                        animate={{ y: 0, rotateX: 0, opacity: 1 }}
                        exit={{ y: "-100%", rotateX: 80, opacity: 0 }}
                        transition={{ duration: 0.55, ease: EASE }}
                        className="inline-block whitespace-nowrap"
                        style={{ color: w.fg || "var(--color-slate-900)" }}
                    >
                        {w.text}
                    </motion.span>
                </AnimatePresence>
            </span>
        </span>
    );
};

// Decorative floating blocks with scroll parallax.
const Shapes = ({ progress }) => {
    const reduce = useReducedMotion();
    const y1 = useTransform(progress, [0, 1], [0, -160]);
    const y2 = useTransform(progress, [0, 1], [0, -90]);
    const r = useTransform(progress, [0, 1], [0, 120]);
    const float = (d) => (reduce ? {} : { animate: { y: [0, -14, 0] }, transition: { duration: d, repeat: Infinity, ease: "easeInOut" } });
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <motion.div style={{ y: y1, rotate: r }} className="absolute top-24 right-[46%] hidden lg:block">
                <motion.div {...float(5)} className="w-14 h-14 rounded-md border border-slate-900" style={{ background: "var(--color-mustard)", boxShadow: "3px 3px 0 0 var(--color-slate-900)" }} />
            </motion.div>
            <motion.div style={{ y: y2 }} className="absolute bottom-24 left-[42%] hidden md:block">
                <motion.div {...float(6.5)} className="w-10 h-10 rounded-full border border-slate-900" style={{ background: "var(--color-cobalt)" }} />
            </motion.div>
            <motion.div style={{ y: y1 }} className="absolute top-10 right-6">
                <motion.svg {...float(7)} width="46" height="46" viewBox="0 0 46 46">
                    <polygon points="23,3 43,41 3,41" fill="var(--color-moss)" stroke="var(--color-slate-900)" strokeWidth="1.5" />
                </motion.svg>
            </motion.div>
            <motion.div style={{ y: y2, rotate: r }} className="absolute bottom-10 left-4 hidden sm:block">
                <svg width="60" height="60" viewBox="0 0 60 60">
                    <path d="M30 2 L36 24 L58 30 L36 36 L30 58 L24 36 L2 30 L24 24 Z" fill="var(--color-lilac)" stroke="var(--color-slate-900)" strokeWidth="1.5" />
                </svg>
            </motion.div>
        </div>
    );
};

// `featured` = the deepest-discounted product already loaded by Home.
export const HeroBanner = ({ featured, loading }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const img = featured ? featured.thumbnail || parseImages(featured.image)[0] : null;
    const hasDeal = featured && Number(featured.specialPrice) < Number(featured.price);

    return (
        <section ref={ref} className="relative pt-16 border-b border-slate-900 bg-slate-50 overflow-hidden">
            {/* dotted paper grid */}
            <div
                className="absolute inset-0 opacity-[0.35]"
                style={{ backgroundImage: "radial-gradient(var(--color-slate-300) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
                aria-hidden="true"
            />
            <Shapes progress={scrollYProgress} />

            <div className="relative max-w-7xl mx-auto px-5 md:px-6 grid lg:grid-cols-[1.25fr_1fr] gap-12 lg:gap-14 py-14 lg:py-20">
                <div className="flex flex-col justify-center">
                    <motion.p
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className="label-mono text-blue-700 mb-6 inline-flex items-center gap-2"
                    >
                        <span className="relative flex w-2 h-2" aria-hidden="true">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75 animate-ping motion-reduce:animate-none" />
                            <span className="relative inline-flex w-2 h-2 rounded-full bg-blue-600" />
                        </span>
                        Steam keys · Instant delivery
                    </motion.p>

                    <h1 className="display text-[13vw] sm:text-7xl lg:text-[6.2rem] text-slate-900">
                        <SplitReveal as="span" lines={["Play it"]} className="block" />
                        <motion.span
                            className="block mt-1"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
                        >
                            <RotatingWord />
                        </motion.span>
                        <SplitReveal as="span" lines={[{ text: "Pay less.", className: "text-blue-600" }]} delay={0.4} className="block mt-1" />
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
                        className="mt-7 max-w-md text-base md:text-lg leading-relaxed text-slate-600"
                    >
                        Official game keys at prices that make sense. Buy, reveal your code, redeem on Steam — done before the kettle boils.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
                        className="mt-9 flex flex-wrap gap-3"
                    >
                        <Magnetic>
                            <Link to="/products" className="btn-accent group !px-6 !py-3.5 text-[15px]">
                                Browse games
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                            </Link>
                        </Magnetic>
                        <Link to="/faq" className="btn-line !px-6 !py-3.5 text-[15px] bg-white">How it works</Link>
                    </motion.div>
                </div>

                {/* Deal ticket */}
                <motion.div
                    className="relative self-center"
                    initial={{ opacity: 0, y: 40, rotate: 4 }}
                    animate={{ opacity: 1, y: 0, rotate: -1.5 }}
                    transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
                >
                    {featured ? (
                        <>
                            <Tilt className="rounded-lg" max={9}>
                                <Link
                                    to={`/products/product/${featured.productId}`}
                                    className="group block panel overflow-hidden"
                                    style={{ boxShadow: "8px 8px 0 0 var(--color-cobalt)" }}
                                >
                                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-900 bg-slate-900 text-slate-50">
                                        <span className="label-mono">Deal of the moment</span>
                                        <span className="label-mono text-slate-400">No. {String(featured.productId).padStart(4, "0")}</span>
                                    </div>
                                    <div className="aspect-[16/9] bg-slate-200 overflow-hidden border-b border-slate-900">
                                        {img && <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />}
                                    </div>
                                    <div className="p-5 flex items-end justify-between gap-4" style={{ transform: "translateZ(30px)" }}>
                                        <div className="min-w-0">
                                            <p className="text-xl font-extrabold leading-tight text-slate-900 truncate" style={{ fontStretch: "110%" }}>
                                                {featured.productName}
                                            </p>
                                            <p className="mt-1 label-mono text-slate-500">PC · Steam key</p>
                                        </div>
                                        <div className="text-right font-mono tabular-nums shrink-0">
                                            {hasDeal && <p className="text-sm text-slate-400 line-through">${Number(featured.price).toFixed(2)}</p>}
                                            <p className="text-2xl font-semibold text-slate-900">
                                                ${Number(hasDeal ? featured.specialPrice : featured.price).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="border-t border-dashed border-slate-400 mx-5" aria-hidden="true" />
                                    <div className="px-5 py-3 flex items-center justify-between text-sm font-bold text-slate-900">
                                        <span>View game</span>
                                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                    </div>
                                </Link>
                            </Tilt>
                            {hasDeal && (
                                <motion.div
                                    className="absolute -top-8 -right-4 sm:-right-8 z-10"
                                    initial={{ scale: 0, rotate: -90 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 12, delay: 1 }}
                                >
                                    <Sticker
                                        className="w-28 h-28 text-2xl"
                                        text="LIMITED DEAL ✦ LIMITED DEAL ✦ "
                                        center={`−${Math.round(Number(featured.discount))}%`}
                                    />
                                </motion.div>
                            )}
                        </>
                    ) : (
                        loading && <div className="panel aspect-[4/3] bg-slate-100 animate-pulse" aria-hidden="true" />
                    )}
                </motion.div>
            </div>

            <div className="relative border-t border-slate-900 bg-white">
                <ul className="max-w-7xl mx-auto px-5 md:px-6 grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                    {FACTS.map(({ icon: Icon, label, sub, bg }, i) => (
                        <motion.li
                            key={label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.9 + i * 0.1, ease: EASE }}
                            className="group flex items-center gap-3 py-4 sm:px-6 first:sm:pl-0"
                        >
                            <span
                                className="grid place-items-center w-9 h-9 rounded-md border border-slate-900 shrink-0 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
                                style={{ background: bg }}
                            >
                                <Icon size={17} className="text-slate-900" aria-hidden="true" />
                            </span>
                            <p className="text-sm">
                                <span className="font-bold text-slate-900">{label}</span>{" "}
                                <span className="text-slate-500">{sub}</span>
                            </p>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </section>
    );
};
