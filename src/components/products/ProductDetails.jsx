import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { Header } from "../shared/Header";
// import { addToCart, addToWishlist } from "../../store/actions";

// ── Icons ──────────────────────────────────────────────────────────────────────

const StarIcon = ({ filled, half }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : half ? "url(#half)" : "none"}
        stroke="#f59e0b" strokeWidth="1.5">
        {half && (
            <defs>
                <linearGradient id="half"><stop offset="50%" stopColor="#f59e0b" /><stop offset="50%" stopColor="transparent" /></linearGradient>
            </defs>
        )}
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const HeartIcon = ({ filled }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const CartIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);

const ShareIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

const ChevronLeft = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const ChevronRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const CheckIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const TruckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);

const RefreshIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4" />
    </svg>
);

const MinusIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const PlusIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_REVIEWS = [
    { id: 1, name: "Sarah M.", avatar: "SM", rating: 5, date: "Dec 12, 2024", comment: "Absolutely love this! The quality is outstanding and shipping was super fast. Will definitely buy again.", verified: true },
    { id: 2, name: "James K.", avatar: "JK", rating: 4, date: "Dec 8, 2024", comment: "Great product overall. Fits perfectly and looks exactly like the photos. Only minor issue was the packaging could be better.", verified: true },
    { id: 3, name: "Linh N.", avatar: "LN", rating: 5, date: "Nov 30, 2024", comment: "Perfect in every way. Already recommended to all my friends!", verified: false },
];

const RATING_BARS = [
    { stars: 5, pct: 68 },
    { stars: 4, pct: 21 },
    { stars: 3, pct: 7 },
    { stars: 2, pct: 3 },
    { stars: 1, pct: 1 },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

const StarRow = ({ rating, size = 14 }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
            <StarIcon key={s} filled={s <= Math.floor(rating)} half={s === Math.ceil(rating) && rating % 1 >= 0.5} />
        ))}
    </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────

export const ProductDetail = ({ product, onBack }) => {
    const dispatch = useDispatch();

    // Gallery
    const images = product?.images || [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
        "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=600&q=80",
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80",
        "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&q=80",
    ];

    const [activeImg, setActiveImg] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [qty, setQty] = useState(1);
    const [wishlisted, setWishlisted] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [activeTab, setActiveTab] = useState("description");

    const colors = product?.colors || [
        { name: "Midnight Black", hex: "#1e293b" },
        { name: "Sky Blue", hex: "#3b82f6" },
        { name: "Rose", hex: "#f43f5e" },
        { name: "Sage", hex: "#84cc16" },
    ];

    const sizes = product?.sizes || ["XS", "S", "M", "L", "XL", "XXL"];

    const name = product?.name || "Premium Minimalist Watch";
    const price = product?.price || 129.99;
    const originalPrice = product?.originalPrice || 189.99;
    const rating = product?.rating || 4.7;
    const reviewCount = product?.reviewCount || 248;
    const discount = Math.round((1 - price / originalPrice) * 100);
    const description = product?.description || "Crafted for those who appreciate precision and elegance. This timepiece blends modern minimalism with Swiss-inspired craftsmanship — featuring a scratch-resistant sapphire crystal, genuine leather strap, and 5ATM water resistance.";

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, qty, color: colors[selectedColor], size: selectedSize }));
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2200);
    };

    const handleWishlist = () => {
        setWishlisted((w) => !w);
        dispatch(addToWishlist(product));
    };

    const prevImg = () => setActiveImg((p) => (p - 1 + images.length) % images.length);
    const nextImg = () => setActiveImg((p) => (p + 1) % images.length);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:ital,wght@0,200..900;1,200..900&display=swap');
                .pd-wrap * { font-family: 'Reddit Sans', sans-serif; }
                .thumb-active { box-shadow: 0 0 0 2px #3b82f6; }
                .size-btn:hover { border-color: #3b82f6; color: #3b82f6; }
                .tab-active { box-shadow: inset 0 -2px 0 #3b82f6; }
            `}</style>
            <Header/>
            <div className="pd-wrap w-full max-w-5xl mx-auto px-4 py-6 mt-24">

                {/* Back */}
                {onBack && (
                    <motion.button
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={onBack}
                        className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-500 mb-6 transition-colors duration-150"
                    >
                        <ChevronLeft /> Back to products
                    </motion.button>
                )}

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                    {/* ── LEFT: Gallery ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-3"
                    >
                        {/* Main image */}
                        <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-square">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImg}
                                    src={images[activeImg]}
                                    alt={name}
                                    initial={{ opacity: 0, scale: 1.04 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>

                            {/* Discount badge */}
                            {discount > 0 && (
                                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                                    -{discount}%
                                </div>
                            )}

                            {/* Nav arrows */}
                            <button onClick={prevImg}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-slate-600 hover:bg-white transition-all duration-150">
                                <ChevronLeft />
                            </button>
                            <button onClick={nextImg}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-slate-600 hover:bg-white transition-all duration-150">
                                <ChevronRight />
                            </button>

                            {/* Dot indicators */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {images.map((_, idx) => (
                                    <button key={idx} onClick={() => setActiveImg(idx)}
                                        className={`rounded-full transition-all duration-200 ${activeImg === idx ? "w-5 h-1.5 bg-blue-500" : "w-1.5 h-1.5 bg-white/60"}`} />
                                ))}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-2">
                            {images.map((img, idx) => (
                                <button key={idx} onClick={() => setActiveImg(idx)}
                                    className={`rounded-xl overflow-hidden aspect-square border-2 transition-all duration-150
                                        ${activeImg === idx ? "border-blue-500 thumb-active" : "border-transparent hover:border-slate-300"}`}>
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── RIGHT: Info ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col gap-5"
                    >
                        {/* Title + actions */}
                        <div>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">
                                        {product?.category || "Accessories"}
                                    </p>
                                    <h1 className="text-2xl font-bold text-slate-800 leading-snug">{name}</h1>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button onClick={handleWishlist}
                                        className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200
                                            ${wishlisted ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-400"}`}>
                                        <HeartIcon filled={wishlisted} />
                                    </button>
                                    <button className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-400 flex items-center justify-center hover:border-slate-300 transition-all duration-150">
                                        <ShareIcon />
                                    </button>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mt-2.5">
                                <StarRow rating={rating} />
                                <span className="text-sm font-bold text-slate-700">{rating}</span>
                                <span className="text-sm text-slate-400">({reviewCount} reviews)</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-slate-800">${price.toFixed(2)}</span>
                            {originalPrice > price && (
                                <>
                                    <span className="text-lg text-slate-400 line-through">${originalPrice.toFixed(2)}</span>
                                    <span className="text-sm font-bold text-red-500 bg-red-50 border border-red-200 rounded-lg px-2 py-0.5">
                                        Save ${(originalPrice - price).toFixed(2)}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Color */}
                        <div>
                            <div className="flex items-center justify-between mb-2.5">
                                <p className="text-sm font-bold text-slate-700">Color</p>
                                <p className="text-sm text-slate-500">{colors[selectedColor].name}</p>
                            </div>
                            <div className="flex gap-2.5">
                                {colors.map((color, idx) => (
                                    <button key={idx} onClick={() => setSelectedColor(idx)}
                                        title={color.name}
                                        className="relative w-8 h-8 rounded-full transition-transform duration-150 hover:scale-110"
                                        style={{ background: color.hex }}
                                    >
                                        {selectedColor === idx && (
                                            <motion.span
                                                layoutId="colorCheck"
                                                className="absolute inset-0 flex items-center justify-center text-white"
                                            >
                                                <CheckIcon />
                                            </motion.span>
                                        )}
                                        {selectedColor === idx && (
                                            <span className="absolute -inset-1 rounded-full border-2 border-blue-500 pointer-events-none" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size */}
                        <div>
                            <div className="flex items-center justify-between mb-2.5">
                                <p className="text-sm font-bold text-slate-700">Size</p>
                                <button className="text-xs font-semibold text-blue-500 hover:underline">Size guide</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((size) => (
                                    <button key={size} onClick={() => setSelectedSize(size)}
                                        className={`size-btn min-w-[44px] h-10 px-3 rounded-xl border text-sm font-semibold transition-all duration-150
                                            ${selectedSize === size
                                                ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                                                : "border-slate-200 bg-white text-slate-600"
                                            }`}>
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity + CTA */}
                        <div className="flex items-center gap-3">
                            {/* Qty stepper */}
                            <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-white">
                                <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                                    <MinusIcon />
                                </button>
                                <span className="w-8 text-center text-sm font-bold text-slate-800">{qty}</span>
                                <button onClick={() => setQty((q) => q + 1)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                                    <PlusIcon />
                                </button>
                            </div>

                            {/* Add to cart */}
                            <motion.button
                                onClick={handleAddToCart}
                                whileTap={{ scale: 0.97 }}
                                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-200
                                    ${addedToCart
                                        ? "bg-emerald-500 text-white"
                                        : "bg-blue-500 hover:bg-blue-600 text-white"
                                    }`}
                                style={{ boxShadow: addedToCart ? "0 4px 14px rgba(16,185,129,0.35)" : "0 4px 14px rgba(59,130,246,0.3)" }}
                            >
                                <AnimatePresence mode="wait">
                                    {addedToCart ? (
                                        <motion.span key="done" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="flex items-center gap-2">
                                            <CheckIcon /> Added to cart!
                                        </motion.span>
                                    ) : (
                                        <motion.span key="add" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="flex items-center gap-2">
                                            <CartIcon /> Add to Cart
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-2 pt-1">
                            {[
                                { icon: <TruckIcon />, label: "Free shipping", sub: "Orders over $50" },
                                { icon: <RefreshIcon />, label: "30-day returns", sub: "No questions asked" },
                                { icon: <ShieldIcon />, label: "2-year warranty", sub: "Full coverage" },
                            ].map((b, i) => (
                                <div key={i} className="flex flex-col items-center text-center gap-1 px-2 py-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-blue-500">{b.icon}</span>
                                    <p className="text-xs font-bold text-slate-700 leading-tight">{b.label}</p>
                                    <p className="text-xs text-slate-400 leading-tight">{b.sub}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── Tabs: Description / Reviews ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mt-10"
                >
                    {/* Tab headers */}
                    <div className="flex border-b border-slate-200 mb-6">
                        {["description", "reviews"].map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`px-5 py-3 text-sm font-bold capitalize transition-all duration-150 border-b-2 -mb-px
                                    ${activeTab === tab
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-slate-400 hover:text-slate-600"
                                    }`}>
                                {tab} {tab === "reviews" && <span className="ml-1 text-xs bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">{reviewCount}</span>}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === "description" ? (
                            <motion.div key="desc"
                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
                                <ul className="space-y-2">
                                    {[
                                        "Scratch-resistant sapphire crystal glass",
                                        "Genuine Italian leather strap",
                                        "5ATM water resistant (50m depth)",
                                        "Swiss-inspired quartz movement",
                                        "Stainless steel 316L case",
                                    ].map((feat, i) => (
                                        <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center flex-shrink-0">
                                                <CheckIcon />
                                            </span>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ) : (
                            <motion.div key="reviews"
                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                {/* Rating summary */}
                                <div className="flex gap-8 items-center p-5 rounded-2xl bg-blue-50 border border-blue-100">
                                    <div className="text-center flex-shrink-0">
                                        <p className="text-5xl font-bold text-slate-800">{rating}</p>
                                        <StarRow rating={rating} />
                                        <p className="text-xs text-slate-400 mt-1">{reviewCount} reviews</p>
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        {RATING_BARS.map((b) => (
                                            <div key={b.stars} className="flex items-center gap-2">
                                                <span className="text-xs text-slate-500 w-3">{b.stars}</span>
                                                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${b.pct}%` }}
                                                        transition={{ duration: 0.6, delay: 0.1 * (5 - b.stars) }}
                                                        className="h-full bg-amber-400 rounded-full"
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-400 w-6">{b.pct}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Review cards */}
                                <div className="space-y-3">
                                    {MOCK_REVIEWS.map((r, i) => (
                                        <motion.div key={r.id}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.28, delay: i * 0.07 }}
                                            className="p-4 rounded-2xl border border-slate-200 bg-white"
                                        >
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                        {r.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="text-sm font-bold text-slate-800">{r.name}</p>
                                                            {r.verified && (
                                                                <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-1.5 py-0.5 font-semibold">
                                                                    ✓ Verified
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-400">{r.date}</p>
                                                    </div>
                                                </div>
                                                <StarRow rating={r.rating} />
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">{r.comment}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </>
    );
};