import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import ProductViewModal from "./ProductViewModal";
import { TruncateText } from "../utils/TruncateText";
import { useDispatch } from "react-redux";
import { addProductToCart } from "../../store/actions";
import { motion } from "framer-motion";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

// ── Icons ──────────────────────────────────────────────────────────────────────

const CartIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);

// ── Component ──────────────────────────────────────────────────────────────────

const ProductCard = ({
    productId,
    productName,
    image,
    description,
    quantity,
    price,
    discount,
    specialPrice,
}) => {
    const [imgError, setImgError] = useState(false);
    const isAvailable = quantity && Number(quantity) > 0;
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const pathname = useLocation().pathname;
    const navigate = useNavigate();

    const productData = { productId, productName, image, description, quantity, price, discount, specialPrice };

    const handleProductView = () => {
        navigate(`/products/product/${productData.productId}`);
    };

    const handleAddProductToCart = (e) => {
        e.stopPropagation();
        dispatch(addProductToCart(productData, 1));
    };

    const discountPct = discount ? Number(discount * 100).toFixed(0) : null;

    return (
        <>
            <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="group rounded-2xl border border-slate-200 bg-white overflow-hidden cursor-pointer flex flex-col"
                style={{
                    fontFamily: "'Reddit Sans', sans-serif",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    transition: "box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"}
            >
                {/* Image */}
                <div
                    className="relative overflow-hidden aspect-[4/3] bg-slate-50"
                    onClick={handleProductView}
                >
                    {/* Discount badge */}
                    {discountPct && (
                        <div className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg"
                            style={{ fontFamily: "'Reddit Sans', sans-serif" }}>
                            -{discountPct}%
                        </div>
                    )}

                    {/* Out of stock badge */}
                    {!isAvailable && (
                        <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl"
                                style={{ fontFamily: "'Reddit Sans', sans-serif" }}>
                                Out of stock
                            </span>
                        </div>
                    )}

                    <img
                        src={imgError ? "/placeholder.png" : image}
                        alt={productName}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">

                    {/* Title */}
                    <h2
                        className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-150 leading-snug mb-1.5"
                        style={{ fontFamily: "'Reddit Sans', sans-serif" }}
                    >
                        {TruncateText(productName, 40)}
                    </h2>

                    {/* Description */}
                    <p className="text-xs text-slate-400 leading-relaxed flex-1"
                        style={{ fontFamily: "'Reddit Sans', sans-serif" }}>
                        {TruncateText(description, 65)}
                    </p>

                    {/* Price + button */}
                    <div className="flex items-end justify-between mt-4 gap-2">

                        {/* Price */}
                        <div>
                            {specialPrice ? (
                                <>
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <span className="text-xs text-slate-400 line-through"
                                            style={{ fontFamily: "'Reddit Sans', sans-serif" }}>
                                            ${Number(price).toFixed(2)}
                                        </span>
                                        <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-md"
                                            style={{ fontFamily: "'Reddit Sans', sans-serif" }}>
                                            -{discountPct}%
                                        </span>
                                    </div>
                                    <span className="text-lg font-extrabold text-slate-900"
                                        style={{ fontFamily: "'Reddit Sans', sans-serif" }}>
                                        ${Number(specialPrice).toFixed(2)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-lg font-extrabold text-slate-900"
                                    style={{ fontFamily: "'Reddit Sans', sans-serif" }}>
                                    ${Number(price).toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Add to cart */}
                        <motion.button
                            whileTap={{ scale: 0.94 }}
                            disabled={!isAvailable}
                            onClick={handleAddProductToCart}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold flex-shrink-0 transition-all duration-150
                                ${isAvailable
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                }`}
                            style={{
                                fontFamily: "'Reddit Sans', sans-serif",
                                boxShadow: isAvailable ? "0 2px 8px rgba(59,130,246,0.3)" : "none",
                            }}
                        >
                            <CartIcon />
                            {isAvailable ? "Add" : "Sold"}
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* {openProductViewModal && (
                <ProductViewModal
                    open={openProductViewModal}
                    onClose={() => setOpenProductViewModal(false)}
                    product={selectedViewProduct}
                />
            )} */}
        </>
    );
};

export default ProductCard;