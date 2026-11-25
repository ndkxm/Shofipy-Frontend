import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Check, ImageOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { addProductToCart } from "../../store/actions";
import { TruncateText } from "../utils/TruncateText";
import { parseImages } from "../utils/ParseImages";
import { accentAt } from "./Motion";

export const ProductCard = ({
    productId,
    productName,
    thumbnail,
    image,
    description,
    quantity,
    price,
    discount,
    specialPrice,
    index = 0,
}) => {
    const [imgError, setImgError] = useState(false);
    const [justAdded, setJustAdded] = useState(false);
    const isAvailable = quantity && Number(quantity) > 0;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accent = accentAt(index);

    const primaryImage = thumbnail || parseImages(image)[0] || null;
    const productData = { productId, productName, thumbnail, image, description, quantity, price, discount, specialPrice };

    const handleProductView = () => navigate(`/products/product/${productId}`);

    const handleAddProductToCart = (e) => {
        e.stopPropagation();
        dispatch(addProductToCart(productData, 1));
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1400);
    };

    const discountPct = discount && Number(discount) > 0 ? Math.round(Number(discount)) : null;
    const hasDiscount = discountPct !== null && specialPrice && Number(specialPrice) < Number(price);

    return (
        <motion.article
            initial="rest"
            animate="rest"
            whileHover="hover"
            variants={{
                rest: { x: 0, y: 0, boxShadow: "0px 0px 0 0 var(--color-slate-900)" },
                hover: { x: -4, y: -4, boxShadow: "6px 6px 0 0 var(--color-slate-900)" },
            }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            className="group relative h-full flex flex-col bg-white border border-slate-900 rounded-lg overflow-hidden"
        >
            <button
                type="button"
                onClick={handleProductView}
                className="relative block aspect-[16/10] overflow-hidden border-b border-slate-900 text-left"
                style={{ background: accent.soft }}
                aria-label={`View ${productName}`}
            >
                {primaryImage && !imgError ? (
                    <motion.img
                        src={primaryImage}
                        alt=""
                        loading="lazy"
                        onError={() => setImgError(true)}
                        variants={{ rest: { scale: 1 }, hover: { scale: 1.07 } }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className={`w-full h-full object-cover ${!isAvailable ? "grayscale opacity-60" : ""}`}
                    />
                ) : (
                    <div className="w-full h-full grid place-items-center text-slate-500">
                        <ImageOff size={32} strokeWidth={1.5} aria-hidden="true" />
                    </div>
                )}

                {/* light sweep on hover */}
                <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-20deg]"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)" }}
                    variants={{ rest: { x: "0%" }, hover: { x: "320%" } }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
                {/* colour wash from the bottom */}
                <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 origin-left"
                    style={{ background: accent.solid }}
                    variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />

                {hasDiscount && (
                    <motion.span
                        className="absolute top-2.5 left-2.5 bg-blue-600 text-white font-mono text-xs font-semibold px-2 py-1 rounded-sm border border-slate-900"
                        variants={{ rest: { rotate: -4, scale: 1 }, hover: { rotate: 3, scale: 1.12 } }}
                        transition={{ type: "spring", stiffness: 400, damping: 12 }}
                    >
                        −{discountPct}%
                    </motion.span>
                )}
                {!isAvailable && (
                    <span className="absolute top-0 right-0 bg-slate-900 text-slate-50 label-mono px-2 py-1">Sold out</span>
                )}
            </button>

            <div className="flex flex-col flex-1 p-4">
                <h3
                    onClick={handleProductView}
                    className="text-[15px] font-bold leading-snug text-slate-900 cursor-pointer"
                    style={{ fontStretch: "100%", letterSpacing: "-0.01em" }}
                >
                    <span
                        className="bg-no-repeat bg-left-bottom transition-[background-size] duration-300 [background-size:0%_40%] group-hover:[background-size:100%_40%]"
                        style={{ backgroundImage: `linear-gradient(${accent.soft}, ${accent.soft})` }}
                    >
                        {TruncateText(productName, 44)}
                    </span>
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500 flex-1">
                    {TruncateText(description, 70)}
                </p>

                <div className="mt-4 pt-3 border-t border-dashed border-slate-300 flex items-end justify-between gap-3">
                    <div className="font-mono tabular-nums leading-none">
                        {hasDiscount && (
                            <span className="block text-xs text-slate-400 line-through mb-1">${Number(price).toFixed(2)}</span>
                        )}
                        <span className={`text-lg font-semibold ${hasDiscount ? "text-blue-700" : "text-slate-900"}`}>
                            ${Number(hasDiscount ? specialPrice : price).toFixed(2)}
                        </span>
                    </div>

                    <motion.button
                        type="button"
                        disabled={!isAvailable}
                        onClick={handleAddProductToCart}
                        whileTap={isAvailable ? { scale: 0.9 } : undefined}
                        aria-label={isAvailable ? `Add ${productName} to cart` : `${productName} is sold out`}
                        className={`relative inline-flex items-center gap-1 h-9 px-3 rounded-md border text-xs font-bold overflow-hidden transition-colors duration-150
                            ${isAvailable
                                ? justAdded
                                    ? "border-slate-900 bg-[var(--color-moss)] text-white"
                                    : "border-slate-900 bg-slate-900 text-slate-50 hover:bg-blue-600 hover:border-blue-600"
                                : "border-slate-300 text-slate-400 cursor-not-allowed"}`}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {!isAvailable ? (
                                <span key="sold">Sold out</span>
                            ) : justAdded ? (
                                <motion.span key="ok" className="inline-flex items-center gap-1" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>
                                    <Check size={14} strokeWidth={3} aria-hidden="true" /> Added
                                </motion.span>
                            ) : (
                                <motion.span key="add" className="inline-flex items-center gap-1" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>
                                    <Plus size={14} strokeWidth={2.5} aria-hidden="true" /> Cart
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </div>

            {/* confetti burst when added */}
            <AnimatePresence>
                {justAdded && (
                    <div className="pointer-events-none absolute bottom-8 right-10" aria-hidden="true">
                        {Array.from({ length: 10 }).map((_, k) => {
                            const a = (k / 10) * Math.PI * 2;
                            return (
                                <motion.span
                                    key={k}
                                    className="absolute w-2 h-2 rounded-[2px] border border-slate-900"
                                    style={{ background: accentAt(k).solid }}
                                    initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                                    animate={{ x: Math.cos(a) * 46, y: Math.sin(a) * 46 - 20, opacity: 0, rotate: 180 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.75, ease: "easeOut" }}
                                />
                            );
                        })}
                    </div>
                )}
            </AnimatePresence>
        </motion.article>
    );
};
