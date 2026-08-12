import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { TruncateText } from "../utils/TruncateText";
import { ConfirmModal } from "../shared/ConfirmModal";
import {
    fetchUserCart,
    removeProductFromCart,
} from "../../store/actions";

const TrashIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
);

export const CartItem = ({ product }) => {
    const [open, setOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const { cartId } = useSelector((state) => state.carts);
    const dispatch = useDispatch();

    const handleRemove = () => {
        dispatch(removeProductFromCart(product, cartId));
        dispatch(fetchUserCart());
        setOpen(false);
    };

    const unitPrice = (product.specialPrice || product.price);

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-4 p-4 bg-white border border-slate-200 rounded-2xl transition-shadow duration-200 hover:shadow-md"
                style={{ fontFamily: "'Reddit Sans', sans-serif" }}
            >
                {/* Image */}
                <div className="w-24 h-24 lg:w-28 lg:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                    <img
                        src={imgError ? "/placeholder.png" : product.thumbnail }
                        alt={product.productName}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover transition-transform duration-400 hover:scale-105"
                    />
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 justify-between min-w-0">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800 hover:text-blue-600 cursor-pointer leading-snug transition-colors duration-150">
                            {TruncateText(product.productName, 55)}
                        </h2>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {TruncateText(product.description, 80)}
                        </p>
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">

                        {/* Price */}
                        <div>
                            {product.specialPrice ? (
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 line-through">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <span className="text-base font-extrabold text-slate-900">
                                        ${product.specialPrice.toFixed(2)}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-base font-extrabold text-slate-900">
                                    ${product.price.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Qty badge + line total + remove */}
                        <div className="flex items-center gap-3">
                            {/* Static qty badge */}
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 select-none">
                                ×1
                            </span>

                            <span className="text-sm font-bold text-slate-700 hidden sm:block">
                                = ${unitPrice.toFixed(2)}
                            </span>

                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setOpen(true)}
                                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
                            >
                                <TrashIcon />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <ConfirmModal
                isOpen={open}
                message={`Remove "${TruncateText(product.productName, 30)}" from cart?`}
                onConfirm={handleRemove}
                onCancel={() => setOpen(false)}
            />
        </>
    );
};