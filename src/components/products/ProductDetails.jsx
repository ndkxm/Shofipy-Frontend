import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Header } from "../shared/Header";
import { Footer } from "../shared/Footer";
import { addProductToCart } from "../../store/actions";
import api from "../../api/api";

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const fmt = (v) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(Number(v || 0));

const ease = [0.22, 1, 0.36, 1];
const fadeUp = (i = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.38, delay: 0.04 + i * 0.07, ease },
});

/* ─── Skeleton ───────────────────────────────────────────────────────────── */

const Sk = ({ className }) => (
    <div className={`animate-pulse rounded-xl bg-slate-200 ${className}`} />
);

/* ─── Icons ──────────────────────────────────────────────────────────────── */

const IcoCart = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
);
const IcoCheck = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const IcoChevL = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);
const IcoChevR = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);
const IcoX = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);
const IcoExpand = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
);
const IcoWin = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.851" />
    </svg>
);
const IcoMac = () => (
    <svg width="13" height="13" viewBox="0 0 814 1000" fill="currentColor">
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.8 0 663.5 0 541.8 0 345.5 136.9 245 274.8 245c84.1 0 154 55.4 207.6 55.4 52 0 135.7-59.2 230.9-59.2zm-41.3-212.4c49.3-59.2 84.1-141.2 84.1-224.2 0-14.1-1.3-28.2-3.9-41.6-78.1 3.2-170.5 52-225.3 117.8-44.1 51.3-84.7 133.3-84.7 216.6 0 15.4 2.6 30.7 3.9 35.6 4.5.6 11.6 1.3 18.7 1.3 70.8 0 154.7-47.5 207.2-105.5z" />
    </svg>
);
const IcoLinux = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.504 0c-.155 0-.315.008-.48.021C7.309.112 3.699 3.08 3.699 6.854c0 .854.178 1.68.5 2.438C2.6 10.675 1.5 12.476 1.5 14.333c0 2.024 1.164 3.793 2.937 4.967-.014.113-.014.225-.014.338 0 2.404 1.857 4.36 4.148 4.36 1.003 0 1.93-.371 2.647-.98.718.609 1.644.98 2.647.98 2.291 0 4.148-1.956 4.148-4.36 0-.113 0-.225-.014-.338 1.773-1.174 2.937-2.943 2.937-4.967 0-1.857-1.1-3.658-2.699-5.041.322-.758.5-1.584.5-2.438C18.737 3.08 15.127.112 11.023.021 10.858.008 10.698 0 10.543 0h1.96z" />
    </svg>
);
const IcoTag = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
);
const IcoImages = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);

/* ─── Main Component ─────────────────────────────────────────────────────── */

export const ProductDetail = () => {
    const dispatch = useDispatch();
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [descImages, setDescImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const [added, setAdded] = useState(false);

    const [activeImg, setActiveImg] = useState(0);
    const [slideDir, setSlideDir] = useState(1);
    const [lightbox, setLightbox] = useState(false);

    const thumbsRef = useRef(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                setActiveImg(0);
                const [productRes, imagesRes] = await Promise.allSettled([
                    api.get(`/public/products/${id}`),
                    api.get(`/public/products/${id}/images`),
                ]);
                if (productRes.status === "fulfilled") setProduct(productRes.value.data);
                if (imagesRes.status === "fulfilled") setDescImages(imagesRes.value.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchAll();
    }, [id]);

    /* ── Gallery ── */
    const thumbnail = product?.thumbnail;
    const allImages = [
        ...(thumbnail ? [thumbnail] : []),
        ...descImages.map((img) => img.imageUrl),
    ].filter(Boolean);

    const goTo = (index) => {
        setSlideDir(index > activeImg ? 1 : -1);
        setActiveImg(index);
        thumbsRef.current?.children[index]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    };
    const goPrev = () => goTo((activeImg - 1 + Math.max(allImages.length, 1)) % Math.max(allImages.length, 1));
    const goNext = () => goTo((activeImg + 1) % Math.max(allImages.length, 1));

    const handleAdd = () => {
        if (!product) return;
        dispatch(addProductToCart(product, 1));
        setAdded(true);
        setTimeout(() => setAdded(false), 2400);
    };

    /* ── Derived data ── */
    const name = product?.productName ?? "";
    const price = Number(product?.price ?? 0);
    const specialPrice = Number(product?.specialPrice ?? price);
    const discount = Number(product?.discount ?? 0);
    const saved = price - specialPrice;
    const discountPct = discount > 0 ? Math.round(discount) : null;
    const hasDiscount = discountPct !== null && saved > 0.01;
    const qty_stock = Number(product?.quantity ?? 0);
    const isAvailable = qty_stock > 0;

    const genres = product?.genres ?? [];
    const categories = product?.categories ?? [];
    const developers = product?.developers ?? [];
    const publisher = product?.publisher;
    const releaseDate = product?.releaseDate;

    const platforms = [
        product?.windows && { label: "Windows", icon: <IcoWin /> },
        product?.mac && { label: "macOS", icon: <IcoMac /> },
        product?.linux && { label: "Linux", icon: <IcoLinux /> },
    ].filter(Boolean);

    /* ── Render ── */
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:ital,wght@0,200..900;1,200..900&display=swap');
                .pd-root { font-family: 'Reddit Sans', sans-serif; }
                .pd-thumbstrip::-webkit-scrollbar { display: none; }
                .pd-thumbstrip { scrollbar-width: none; }
            `}</style>

            <Header />

            <main className="pd-root min-h-screen bg-slate-50">

                {/* ── Content area: padding top for header ── */}
                <div className="pt-24 pb-20">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                        {/* ── Page header: title + genre chips ── */}
                        <motion.div className="mb-6" {...fadeUp(0)}>
                            {loading ? (
                                <>
                                    <Sk className="h-9 w-3/4 mb-3" />
                                    <div className="flex gap-2">
                                        <Sk className="h-6 w-20 rounded-full" />
                                        <Sk className="h-6 w-16 rounded-full" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                                        {name}
                                    </h1>
                                    {genres.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {genres.map((g) => (
                                                <span
                                                    key={g.genreId}
                                                    className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-2.5 py-1"
                                                >
                                                    <IcoTag />{g.genreName}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.div>

                        {/* ── 2-column layout ── */}
                        <div className="flex flex-col lg:flex-row gap-8 items-start">

                            {/* ════ Left column ════ */}
                            <div className="flex-1 min-w-0 space-y-5">

                                {/* Gallery */}
                                <motion.div {...fadeUp(1)} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                    {/* Main image */}
                                    <div
                                        className="relative cursor-pointer overflow-hidden bg-slate-100"
                                        style={{ aspectRatio: "16/9" }}
                                        onClick={() => allImages.length > 0 && setLightbox(true)}
                                    >
                                        {loading ? (
                                            <div className="w-full h-full animate-pulse bg-slate-200" />
                                        ) : allImages.length > 0 ? (
                                            <>
                                                <AnimatePresence mode="wait" custom={slideDir}>
                                                    <motion.img
                                                        key={activeImg}
                                                        src={allImages[activeImg]}
                                                        alt={`${name} — screenshot ${activeImg + 1}`}
                                                        className="w-full h-full object-cover"
                                                        custom={slideDir}
                                                        variants={{
                                                            enter: (d) => ({ opacity: 0, x: d * 50 }),
                                                            center: { opacity: 1, x: 0 },
                                                            exit: (d) => ({ opacity: 0, x: d * -50 }),
                                                        }}
                                                        initial="enter"
                                                        animate="center"
                                                        exit="exit"
                                                        transition={{ duration: 0.28, ease }}
                                                    />
                                                </AnimatePresence>

                                                {/* Top-right counter + expand hint */}
                                                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold rounded-lg px-2.5 py-1">
                                                    <IcoExpand />
                                                    {activeImg + 1} / {allImages.length}
                                                </div>

                                                {/* Discount badge */}
                                                {hasDiscount && (
                                                    <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-lg tracking-wide shadow-sm">
                                                        -{discountPct}%
                                                    </div>
                                                )}

                                                {/* Prev/Next arrows */}
                                                {allImages.length > 1 && (
                                                    <>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); goPrev(); }}
                                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-700 shadow-md transition-all hover:scale-105"
                                                        ><IcoChevL /></button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); goNext(); }}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-700 shadow-md transition-all hover:scale-105"
                                                        ><IcoChevR /></button>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                                                <IcoImages />
                                                <span className="text-sm">No images</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Thumbnail strip */}
                                    {!loading && allImages.length > 1 && (
                                        <div
                                            ref={thumbsRef}
                                            className="pd-thumbstrip flex gap-2 px-4 py-3 overflow-x-auto border-t border-slate-100 bg-slate-50"
                                        >
                                            {allImages.map((src, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => goTo(i)}
                                                    className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                                                        i === activeImg
                                                            ? "border-blue-500 opacity-100 scale-105"
                                                            : "border-transparent opacity-50 hover:opacity-75"
                                                    }`}
                                                    style={{ width: 72, height: 48 }}
                                                >
                                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>

                                {/* About this game */}
                                <motion.div
                                    {...fadeUp(2)}
                                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6"
                                >
                                    <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">
                                        About this game
                                    </h2>
                                    {loading ? (
                                        <div className="space-y-2">
                                            <Sk className="h-4 w-full" />
                                            <Sk className="h-4 w-11/12" />
                                            <Sk className="h-4 w-4/6" />
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                            {product?.description || "No description available."}
                                        </p>
                                    )}
                                </motion.div>

                                {/* Game details */}
                                <motion.div
                                    {...fadeUp(3)}
                                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6"
                                >
                                    <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">
                                        Game details
                                    </h2>
                                    {loading ? (
                                        <div className="space-y-3">
                                            {[...Array(5)].map((_, i) => <Sk key={i} className="h-5 w-full" />)}
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-100">
                                            {developers.length > 0 && (
                                                <DetailRow label="Developer">
                                                    <div className="flex flex-wrap gap-x-2">
                                                        {developers.map((d) => (
                                                            <span key={d.developerId} className="text-sm font-semibold text-blue-600">
                                                                {d.developerName}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </DetailRow>
                                            )}
                                            {publisher && (
                                                <DetailRow label="Publisher">
                                                    <span className="text-sm font-semibold text-blue-600">{publisher.publisherName}</span>
                                                </DetailRow>
                                            )}
                                            {releaseDate && (
                                                <DetailRow label="Release date">
                                                    <span className="text-sm text-slate-700">
                                                        {new Date(releaseDate).toLocaleDateString("en-US", {
                                                            year: "numeric", month: "long", day: "numeric",
                                                        })}
                                                    </span>
                                                </DetailRow>
                                            )}
                                            {categories.length > 0 && (
                                                <DetailRow label="Categories">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {categories.map((c) => (
                                                            <span key={c.categoryId} className="text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 rounded-md px-2 py-0.5">
                                                                {c.categoryName}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </DetailRow>
                                            )}
                                            {platforms.length > 0 && (
                                                <DetailRow label="Platforms">
                                                    <div className="flex gap-3 flex-wrap">
                                                        {platforms.map(({ label, icon }) => (
                                                            <div key={label} className="flex items-center gap-1.5 text-sm text-slate-600">
                                                                <span className="text-slate-400">{icon}</span>
                                                                {label}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </DetailRow>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            </div>

                            {/* ════ Right column — sticky sidebar ════ */}
                            <div className="w-full lg:w-72 xl:w-80 shrink-0">
                                <div className="sticky top-24 space-y-4">

                                    {/* Purchase card */}
                                    <motion.div
                                        {...fadeUp(1)}
                                        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4"
                                    >
                                        {/* Thumbnail preview */}
                                        {!loading && thumbnail && (
                                            <img
                                                src={thumbnail}
                                                alt={name}
                                                className="w-full rounded-xl object-cover border border-slate-100"
                                                style={{ aspectRatio: "16/9" }}
                                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                                            />
                                        )}
                                        {loading && <Sk className="w-full rounded-xl" style={{ aspectRatio: "16/9" }} />}

                                        {/* Title in sidebar */}
                                        {!loading ? (
                                            <h2 className="text-sm font-bold text-slate-800 leading-snug">{name}</h2>
                                        ) : (
                                            <Sk className="h-5 w-4/5" />
                                        )}

                                        {/* Price */}
                                        {loading ? (
                                            <Sk className="h-10 w-2/3" />
                                        ) : hasDiscount ? (
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-block bg-rose-500 text-white text-xs font-black px-2 py-0.5 rounded-md">
                                                        -{discountPct}%
                                                    </span>
                                                    <span className="text-sm text-slate-400 line-through">{fmt(price)}</span>
                                                </div>
                                                <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{fmt(specialPrice)}</div>
                                                <p className="text-xs text-emerald-600 font-semibold mt-0.5">You save {fmt(saved)}</p>
                                            </div>
                                        ) : (
                                            <div className="text-2xl font-extrabold text-slate-900">{fmt(price)}</div>
                                        )}

                                        {/* Stock indicator */}
                                        {!loading && (
                                            <div className={`flex items-center gap-2 text-sm font-semibold ${isAvailable ? "text-emerald-600" : "text-red-500"}`}>
                                                <span className={`w-2 h-2 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-red-400"}`} />
                                                {isAvailable ? `${qty_stock} keys available` : "Out of stock"}
                                            </div>
                                        )}


                                        {/* CTA button */}
                                        <motion.button
                                            onClick={handleAdd}
                                            disabled={loading || !isAvailable}
                                            whileTap={{ scale: 0.97 }}
                                            className={`w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                                ${added
                                                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                                                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100"
                                                }`}
                                        >
                                            <AnimatePresence mode="wait">
                                                {added ? (
                                                    <motion.span key="ok" className="flex items-center gap-2"
                                                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                                        <IcoCheck /> Added to cart!
                                                    </motion.span>
                                                ) : (
                                                    <motion.span key="add" className="flex items-center gap-2"
                                                        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                                        <IcoCart />
                                                        {isAvailable ? "Add to Cart" : "Out of Stock"}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>

                                        {/* Platform chips */}
                                        {!loading && platforms.length > 0 && (
                                            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                                                <span className="text-xs text-slate-400">Platforms</span>
                                                <div className="flex gap-2">
                                                    {platforms.map(({ label, icon }) => (
                                                        <span key={label} title={label} className="text-slate-400 hover:text-slate-700 transition-colors cursor-default">
                                                            {icon}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Feature pills */}
                                    {!loading && (
                                        <motion.div {...fadeUp(2)} className="grid grid-cols-2 gap-3">
                                            {[
                                                { emoji: "🔑", label: "Instant key", sub: "Delivered instantly" },
                                                { emoji: "🌍", label: "Global key", sub: "All regions" },
                                                { emoji: "🔒", label: "Secure", sub: "SSL checkout" },
                                                { emoji: "🎮", label: "Steam key", sub: "PC platform" },
                                            ].map((b) => (
                                                <div
                                                    key={b.label}
                                                    className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm hover:shadow transition-shadow"
                                                >
                                                    <div className="text-base mb-1">{b.emoji}</div>
                                                    <p className="text-xs font-bold text-slate-700">{b.label}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">{b.sub}</p>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ── Lightbox ── */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightbox(false)}
                    >
                        {/* Close */}
                        <button
                            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                            onClick={() => setLightbox(false)}
                        ><IcoX /></button>

                        {/* Prev */}
                        {allImages.length > 1 && (
                            <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                            ><IcoChevL /></button>
                        )}

                        {/* Image */}
                        <motion.img
                            key={activeImg}
                            src={allImages[activeImg]}
                            alt={name}
                            className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
                            initial={{ opacity: 0, scale: 0.93 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Next */}
                        {allImages.length > 1 && (
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                                onClick={(e) => { e.stopPropagation(); goNext(); }}
                            ><IcoChevR /></button>
                        )}

                        {/* Dot indicators */}
                        {allImages.length > 1 && (
                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                                {allImages.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => { e.stopPropagation(); goTo(i); }}
                                        className="rounded-full transition-all"
                                        style={{
                                            width: i === activeImg ? 20 : 8,
                                            height: 8,
                                            background: i === activeImg ? "#3b82f6" : "rgba(255,255,255,0.35)",
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </>
    );
};

/* ─── Detail row ─────────────────────────────────────────────────────────── */

const DetailRow = ({ label, children }) => (
    <div className="flex gap-4 py-3 first:pt-0 last:pb-0">
        <span className="text-xs font-extrabold uppercase tracking-wide text-slate-400 w-28 shrink-0 pt-0.5">
            {label}
        </span>
        <div className="flex-1 min-w-0">{children}</div>
    </div>
);