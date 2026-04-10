import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Header } from "../shared/Header";
import { addProductToCart } from "../../store/actions";
import api from "../../api/api";

// ── Helper ─────────────────────────────────────────────────────────────────────

const parseImages = (image) => {
    if (!image) return [];
    if (Array.isArray(image)) return image;

    // Xử lý Python-style list: ['url1', 'url2']
    try {
        // Thay nháy đơn -> nháy đôi để thành JSON hợp lệ
        const jsonStr = image
            .trim()
            .replace(/'/g, '"');
        const parsed = JSON.parse(jsonStr);
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
        // Fallback: extract URLs bằng regex
        const matches = image.match(/https?:\/\/[^\s'"]+/g);
        return matches ?? [];
    }
};

// ── Icons ──────────────────────────────────────────────────────────────────────

const ArrowLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
);
const ArrowRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
);
const MinusIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const PlusIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const CheckIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const BagIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
    </svg>
);
const TagIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
);
const ShieldIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);
const TruckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);
const ReturnIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-4" />
    </svg>
);
const ImagePlaceholder = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-200">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);

// ── Skeleton ───────────────────────────────────────────────────────────────────

const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-blue-100 rounded-xl ${className}`} />
);

// ── Animation helpers ──────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1];
const fadeUp = (i = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.05 + i * 0.08, ease },
});

// ── Main Component ─────────────────────────────────────────────────────────────

export const ProductDetail = ({ onBack }) => {
    const dispatch = useDispatch();
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    // Slideshow state
    const [activeImg, setActiveImg] = useState(0);
    const [slideDir, setSlideDir] = useState(1); // 1 = forward, -1 = backward

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/public/products/${id}`);
                setProduct(res.data);
                setActiveImg(0); // reset slide khi load product mới
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    const name = product?.productName ?? "";
    const description = product?.description ?? "";
    const price = product?.price ?? 0;
    const specialPrice = product?.specialPrice ?? price;
    const discount = product?.discount ?? 0;
    const saved = price - specialPrice;

    // Parse images từ field image (string JSON hoặc array)
    const images = parseImages(product?.image);

    const goTo = (index) => {
        setSlideDir(index > activeImg ? 1 : -1);
        setActiveImg(index);
    };

    const goPrev = () => {
        const newIndex = (activeImg - 1 + images.length) % images.length;
        setSlideDir(-1);
        setActiveImg(newIndex);
    };

    const goNext = () => {
        const newIndex = (activeImg + 1) % images.length;
        setSlideDir(1);
        setActiveImg(newIndex);
    };

    const handleAdd = () => {
        if (!product) return;
        dispatch(addProductToCart(product, qty));
        setAdded(true);
        setTimeout(() => setAdded(false), 2200);
    };

    const strips = [
        { icon: <TruckIcon />, label: "Free Shipping", sub: "Orders over $50" },
        { icon: <ReturnIcon />, label: "30-Day Returns", sub: "No questions asked" },
        { icon: <ShieldIcon />, label: "2-Year Warranty", sub: "Full coverage" },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:ital,wght@0,200..900;1,200..900&display=swap');
                .rs, .rs * { font-family: 'Reddit Sans', sans-serif !important; }
                .thumb-btn { transition: all 0.18s ease; }
                .thumb-btn:hover { transform: scale(1.08); }
                .slide-arrow { transition: all 0.18s ease; }
                .slide-arrow:hover { background: white !important; transform: translateY(-50%) scale(1.1); }
            `}</style>

            <Header />

            <div className="rs min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-24 pb-20 px-4">
                <div className="max-w-2xl mx-auto">

                    {/* Back */}
                    {onBack && (
                        <motion.button
                            onClick={onBack}
                            className="flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-600 transition-colors mb-5 bg-transparent border-0 cursor-pointer"
                            {...fadeUp(0)}
                        >
                            <ArrowLeft /> Back to products
                        </motion.button>
                    )}

                    {/* ── Card ── */}
                    <motion.div
                        className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-blue-100 border border-blue-100"
                        {...fadeUp(0)}
                    >
                        {/* ── Image hero / Slideshow ── */}
                        <div className="relative w-full bg-blue-50 overflow-hidden" style={{ height: 320 }}>

                            {/* Decorative blobs */}
                            <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-blue-100 opacity-60 blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-indigo-100 opacity-50 blur-2xl pointer-events-none" />

                            {/* Main image / skeleton */}
                            {loading ? (
                                <div className="w-full h-full animate-pulse bg-blue-100" />
                            ) : images.length > 0 ? (
                                <AnimatePresence mode="wait" custom={slideDir}>
                                    <motion.img
                                        key={activeImg}
                                        src={images[activeImg]}
                                        alt={`${name} ${activeImg + 1}`}
                                        className="w-full h-full object-contain p-6"
                                        custom={slideDir}
                                        variants={{
                                            enter: (dir) => ({ opacity: 0, x: dir * 40 }),
                                            center: { opacity: 1, x: 0 },
                                            exit: (dir) => ({ opacity: 0, x: dir * -40 }),
                                        }}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.32, ease }}
                                    />
                                </AnimatePresence>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImagePlaceholder />
                                </div>
                            )}

                            {/* Discount badge */}
                            <AnimatePresence>
                                {discount > 0 && !loading && (
                                    <motion.span
                                        className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-lg shadow-blue-300"
                                        initial={{ opacity: 0, scale: 0.75, y: -6 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ duration: 0.35, delay: 0.2, ease }}
                                    >
                                        <TagIcon /> {discount * 100}% OFF
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Prev / Next arrows — chỉ hiện khi có > 1 ảnh */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={goPrev}
                                        className="slide-arrow absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/75 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md border-0 cursor-pointer text-blue-700"
                                        style={{ transform: "translateY(-50%)" }}
                                    >
                                        <ArrowLeft />
                                    </button>
                                    <button
                                        onClick={goNext}
                                        className="slide-arrow absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/75 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md border-0 cursor-pointer text-blue-700"
                                        style={{ transform: "translateY(-50%)" }}
                                    >
                                        <ArrowRight />
                                    </button>
                                </>
                            )}

                            {/* Dot indicators */}
                            {images.length > 1 && (
                                <div className="absolute bottom-3 left-1/2 flex gap-1.5" style={{ transform: "translateX(-50%)" }}>
                                    {images.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => goTo(i)}
                                            className="rounded-full border-0 cursor-pointer transition-all duration-200"
                                            style={{
                                                width: i === activeImg ? 20 : 8,
                                                height: 8,
                                                background: i === activeImg ? "#2563eb" : "#bfdbfe",
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Thumbnail strip — hiện khi có ≥ 2 ảnh */}
                        {!loading && images.length > 1 && (
                            <div className="flex gap-2 px-6 pt-4 pb-1 overflow-x-auto scrollbar-hide">
                                {images.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goTo(i)}
                                        className="thumb-btn flex-shrink-0 rounded-xl overflow-hidden border-2 bg-blue-50 cursor-pointer p-0"
                                        style={{
                                            width: 56,
                                            height: 56,
                                            borderColor: i === activeImg ? "#2563eb" : "#e0e7ff",
                                            opacity: i === activeImg ? 1 : 0.65,
                                        }}
                                    >
                                        <img
                                            src={src}
                                            alt={`thumb-${i}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* ── Content ── */}
                        <div className="p-8">

                            {/* Name */}
                            {loading ? (
                                <Skeleton className="h-7 w-3/4 mb-2" />
                            ) : (
                                <motion.h1
                                    className="text-2xl font-bold text-blue-950 leading-snug"
                                    {...fadeUp(1)}
                                >
                                    {name}
                                </motion.h1>
                            )}

                            {/* Divider */}
                            <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent my-6" />

                            {/* Price row */}
                            {loading ? (
                                <Skeleton className="h-10 w-40 mb-6" />
                            ) : (
                                <motion.div className="flex items-end gap-3 flex-wrap" {...fadeUp(2)}>
                                    <span className="text-4xl font-extrabold text-blue-700 tracking-tight leading-none">
                                        ${specialPrice.toFixed(2)}
                                    </span>
                                    {saved > 0 && (
                                        <div className="flex items-center gap-2 pb-0.5">
                                            <span className="text-base font-medium text-blue-300 line-through leading-none">
                                                ${price.toFixed(2)}
                                            </span>
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1">
                                                Save ${saved.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Description */}
                            {loading ? (
                                <div className="space-y-2 mt-6">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-4/6" />
                                </div>
                            ) : description ? (
                                <motion.p
                                    className="text-sm text-slate-500 leading-relaxed mt-5"
                                    {...fadeUp(3)}
                                >
                                    {description}
                                </motion.p>
                            ) : null}

                            {/* Divider */}
                            <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent my-6" />

                            {/* Qty + CTA */}
                            <motion.div className="flex items-center gap-3" {...fadeUp(4)}>

                                {/* Stepper */}
                                <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-2xl px-2 py-2">
                                    <button
                                        onClick={() => setQty(q => Math.max(1, q - 1))}
                                        className="w-8 h-8 flex items-center justify-center rounded-xl text-blue-500 hover:bg-blue-100 transition-colors border-0 bg-transparent cursor-pointer"
                                    >
                                        <MinusIcon />
                                    </button>
                                    <span className="w-7 text-center text-sm font-bold text-blue-800">{qty}</span>
                                    <button
                                        onClick={() => setQty(q => q + 1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-xl text-blue-500 hover:bg-blue-100 transition-colors border-0 bg-transparent cursor-pointer"
                                    >
                                        <PlusIcon />
                                    </button>
                                </div>

                                {/* Add to cart */}
                                <motion.button
                                    onClick={handleAdd}
                                    disabled={loading}
                                    whileTap={{ scale: 0.97 }}
                                    className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-2xl text-sm font-bold border-0 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                        ${added
                                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 hover:-translate-y-0.5"
                                        }`}
                                >
                                    <AnimatePresence mode="wait">
                                        {added ? (
                                            <motion.span key="done" className="flex items-center gap-2"
                                                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                                <CheckIcon /> Added to cart!
                                            </motion.span>
                                        ) : (
                                            <motion.span key="add" className="flex items-center gap-2"
                                                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                                <BagIcon /> Add to Cart
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* ── Info strips ── */}
                    <motion.div
                        className="grid grid-cols-3 gap-3 mt-4"
                        {...fadeUp(5)}
                    >
                        {strips.map((b, i) => (
                            <div
                                key={i}
                                className="bg-white border border-blue-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2 shadow-sm shadow-blue-50 hover:shadow-md hover:shadow-blue-100 hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                    {b.icon}
                                </div>
                                <p className="text-xs font-bold text-blue-900 leading-tight">{b.label}</p>
                                <p className="text-xs text-blue-300 -mt-1">{b.sub}</p>
                            </div>
                        ))}
                    </motion.div>

                </div>
            </div>
        </>
    );
};