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
    <div className={`animate-pulse rounded-sm bg-slate-200 ${className}`} />
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
    const [descExpanded, setDescExpanded] = useState(false);

    const thumbsRef = useRef(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                setActiveImg(0);
                setDescExpanded(false);
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
    const panel = "bg-white border border-slate-900 rounded-lg";
    const sectionTitle = "label-mono text-slate-500 mb-4";

    if (!loading && !product) {
        return (
            <>
                <Header />
                <main className="min-h-[70vh] bg-slate-50 pt-16 grid place-items-center px-5 text-center">
                    <div>
                        <p className="label-mono text-slate-500 mb-4">Error · game not found</p>
                        <h1 className="display text-5xl md:text-7xl text-slate-900">Game over.</h1>
                        <p className="mt-4 text-slate-600">We couldn’t load this game. It may have been removed, or the server is unreachable.</p>
                        <a href="/products" className="btn-accent mt-8">Back to all games</a>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <main className="min-h-screen bg-slate-50 pt-16">
                {/* Title band */}
                <section className="border-b border-slate-900">
                    <div className="max-w-7xl mx-auto px-5 md:px-6 pt-10 pb-8">
                        {loading ? (
                            <>
                                <Sk className="h-12 w-2/3 mb-4" />
                                <Sk className="h-6 w-40" />
                            </>
                        ) : (
                            <motion.div {...fadeUp(0)}>
                                <p className="label-mono text-slate-500 mb-3">
                                    {publisher?.publisherName ? `${publisher.publisherName} · ` : ""}PC · Steam key
                                </p>
                                <h1 className="display text-4xl sm:text-6xl lg:text-7xl text-slate-900 break-words">{name}</h1>
                                {genres.length > 0 && (
                                    <ul className="flex flex-wrap gap-2 mt-5">
                                        {genres.map((g) => (
                                            <li key={g.genreId} className="text-xs font-semibold border border-slate-900 rounded-sm px-2.5 py-1 text-slate-900">
                                                {g.genreName}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </motion.div>
                        )}
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-5 md:px-6 py-10 overflow-x-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] gap-8 lg:gap-x-10 lg:gap-y-12 items-start">

                        {/* Gallery */}
                        <motion.div {...fadeUp(1)} className={`order-1 min-w-0 ${panel} overflow-hidden`}>
                            <div
                                className="relative cursor-zoom-in overflow-hidden bg-slate-200"
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
                                                    enter: (d) => ({ opacity: 0, x: d * 40 }),
                                                    center: { opacity: 1, x: 0 },
                                                    exit: (d) => ({ opacity: 0, x: d * -40 }),
                                                }}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                transition={{ duration: 0.24, ease }}
                                            />
                                        </AnimatePresence>

                                        <div className="absolute bottom-0 right-0 flex items-center gap-1.5 bg-slate-900 text-slate-50 font-mono text-xs px-2.5 py-1.5">
                                            <IcoExpand />
                                            {String(activeImg + 1).padStart(2, "0")} / {String(allImages.length).padStart(2, "0")}
                                        </div>

                                        {allImages.length > 1 && (
                                            <>
                                                <button
                                                    aria-label="Previous image"
                                                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-900 rounded-md grid place-items-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                                                ><IcoChevL /></button>
                                                <button
                                                    aria-label="Next image"
                                                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-900 rounded-md grid place-items-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                                                ><IcoChevR /></button>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                        <IcoImages />
                                        <span className="label-mono">No images</span>
                                    </div>
                                )}
                            </div>

                            {!loading && allImages.length > 1 && (
                                <div ref={thumbsRef} className="flex gap-2 p-3 overflow-x-auto border-t border-slate-900 bg-slate-50" style={{ scrollbarWidth: "none" }}>
                                    {allImages.map((src, i) => (
                                        <button
                                            key={i}
                                            onClick={() => goTo(i)}
                                            aria-label={`Show image ${i + 1}`}
                                            aria-current={i === activeImg}
                                            className={`flex-shrink-0 rounded-sm overflow-hidden border-2 transition-opacity ${i === activeImg ? "border-blue-600" : "border-transparent opacity-60 hover:opacity-100"}`}
                                            style={{ width: 72, height: 44 }}
                                        >
                                            <img src={src} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* About */}
                        <motion.section {...fadeUp(2)} className="order-3 min-w-0">
                            <h2 className={sectionTitle}>About this game</h2>
                            {loading ? (
                                <div className="space-y-2">
                                    <Sk className="h-4 w-full" />
                                    <Sk className="h-4 w-11/12" />
                                    <Sk className="h-4 w-4/6" />
                                </div>
                            ) : (
                                <GameDescription
                                    text={product?.description || ""}
                                    expanded={descExpanded}
                                    onToggle={() => setDescExpanded((v) => !v)}
                                />
                            )}
                        </motion.section>

                        {/* Details */}
                        <motion.section {...fadeUp(3)} className="order-4 min-w-0">
                            <h2 className={sectionTitle}>Details</h2>
                            {loading ? (
                                <div className="space-y-3">
                                    {[...Array(5)].map((_, i) => <Sk key={i} className="h-5 w-full" />)}
                                </div>
                            ) : (
                                <dl className="border-t border-slate-900">
                                    {developers.length > 0 && (
                                        <DetailRow label="Developer">
                                            {developers.map((d) => d.developerName).join(", ")}
                                        </DetailRow>
                                    )}
                                    {publisher && <DetailRow label="Publisher">{publisher.publisherName}</DetailRow>}
                                    {releaseDate && (
                                        <DetailRow label="Released">
                                            {new Date(releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                                        </DetailRow>
                                    )}
                                    {categories.length > 0 && (
                                        <DetailRow label="Categories">
                                            {categories.map((c) => c.categoryName).join(" · ")}
                                        </DetailRow>
                                    )}
                                    {platforms.length > 0 && (
                                        <DetailRow label="Platforms">
                                            <span className="flex gap-4 flex-wrap">
                                                {platforms.map(({ label, icon }) => (
                                                    <span key={label} className="inline-flex items-center gap-1.5">
                                                        <span className="text-slate-500" aria-hidden="true">{icon}</span>{label}
                                                    </span>
                                                ))}
                                            </span>
                                        </DetailRow>
                                    )}
                                </dl>
                            )}
                        </motion.section>

                        {/* Purchase ticket */}
                        <div className="order-2 min-w-0 lg:row-span-3">
                            <motion.div
                                {...fadeUp(1)}
                                className={`lg:sticky lg:top-24 ${panel} overflow-hidden`}
                                style={{ boxShadow: "5px 5px 0 0 var(--color-slate-900)" }}
                            >
                                <div className="flex items-center justify-between px-5 py-3 bg-slate-900 text-slate-50">
                                    <span className="label-mono">Digital key</span>
                                    {hasDiscount && (
                                        <span className="font-mono text-xs font-semibold bg-blue-600 px-2 py-0.5 rounded-sm">−{discountPct}%</span>
                                    )}
                                </div>

                                <div className="p-5 space-y-5">
                                    {loading ? (
                                        <Sk className="h-12 w-2/3" />
                                    ) : (
                                        <div className="font-mono tabular-nums">
                                            {hasDiscount && <p className="text-sm text-slate-500 line-through">{fmt(price)}</p>}
                                            <p className="text-4xl font-semibold text-slate-900 tracking-tight">{fmt(hasDiscount ? specialPrice : price)}</p>
                                            {hasDiscount && <p className="mt-1 text-sm text-emerald-700 font-semibold">You save {fmt(saved)}</p>}
                                        </div>
                                    )}

                                    {!loading && (
                                        <p className={`flex items-center gap-2 text-sm font-semibold ${isAvailable ? "text-emerald-700" : "text-red-600"}`}>
                                            <span className={`w-2 h-2 ${isAvailable ? "bg-emerald-600" : "bg-red-600"}`} aria-hidden="true" />
                                            {isAvailable ? `${qty_stock} keys in stock` : "Out of stock"}
                                        </p>
                                    )}

                                    <button
                                        onClick={handleAdd}
                                        disabled={loading || !isAvailable}
                                        className={`w-full h-12 inline-flex items-center justify-center gap-2 rounded-md border border-slate-900 text-[15px] font-bold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed
                                            ${added ? "bg-emerald-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                                    >
                                        <span aria-live="polite" className="inline-flex items-center gap-2">
                                            {added ? <><IcoCheck /> Added to cart</> : <><IcoCart /> {isAvailable ? "Add to cart" : "Out of stock"}</>}
                                        </span>
                                    </button>
                                </div>

                                <div className="border-t border-dashed border-slate-400 mx-5" aria-hidden="true" />
                                <ul className="p-5 grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                                    {[
                                        ["Delivery", "Instant"],
                                        ["Platform", "Steam"],
                                        ["Checkout", "Stripe"],
                                        ["Saved in", "My Orders"],
                                    ].map(([k, v]) => (
                                        <li key={k}>
                                            <span className="block label-mono text-slate-500">{k}</span>
                                            <span className="font-semibold text-slate-900">{v}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={`${name} images`}
                        className="fixed inset-0 z-[200] bg-slate-950/95 flex items-center justify-center p-2 sm:p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightbox(false)}
                    >
                        <button
                            aria-label="Close"
                            className="absolute top-4 right-4 w-10 h-10 grid place-items-center border border-slate-600 text-white rounded-md hover:bg-white hover:text-slate-900 transition-colors"
                            onClick={() => setLightbox(false)}
                        ><IcoX /></button>

                        {allImages.length > 1 && (
                            <button
                                aria-label="Previous image"
                                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center border border-slate-600 text-white rounded-md hover:bg-white hover:text-slate-900 transition-colors"
                                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                            ><IcoChevL /></button>
                        )}

                        <motion.img
                            key={activeImg}
                            src={allImages[activeImg]}
                            alt={name}
                            className="max-w-[calc(100%-6rem)] max-h-[85vh] object-contain border border-slate-700"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        />

                        {allImages.length > 1 && (
                            <button
                                aria-label="Next image"
                                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center border border-slate-600 text-white rounded-md hover:bg-white hover:text-slate-900 transition-colors"
                                onClick={(e) => { e.stopPropagation(); goNext(); }}
                            ><IcoChevR /></button>
                        )}

                        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-sm text-slate-300">
                            {activeImg + 1} / {allImages.length}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </>
    );
};

/* ─── Description + detail row ───────────────────────────────────────────── */

const DESC_LIMIT = 320;

const GameDescription = ({ text, expanded, onToggle }) => {
    const raw = (text || "").trim();
    if (!raw) return <p className="text-slate-500">No description available.</p>;

    const tooLong = raw.length > DESC_LIMIT;
    const shown = !tooLong || expanded ? raw : `${raw.slice(0, DESC_LIMIT).trimEnd()}…`;

    return (
        <div className="max-w-prose">
            <p className="text-[15px] text-slate-700 leading-relaxed whitespace-pre-line break-words">{shown}</p>
            {tooLong && (
                <button type="button" onClick={onToggle} aria-expanded={expanded}
                    className="mt-3 text-sm font-bold text-slate-900 underline underline-offset-4 decoration-blue-600 decoration-2 hover:text-blue-700">
                    {expanded ? "Show less" : "Read more"}
                </button>
            )}
        </div>
    );
};

const DetailRow = ({ label, children }) => (
    <div className="grid grid-cols-[7.5rem_1fr] gap-4 py-3 border-b border-slate-200 text-sm">
        <dt className="label-mono text-slate-500 pt-0.5">{label}</dt>
        <dd className="text-slate-900 font-medium min-w-0 break-words">{children}</dd>
    </div>
);
