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
            <motion.li
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="flex gap-4 sm:gap-5 py-5 border-b border-slate-300"
            >
                <div className="w-28 sm:w-40 aspect-[16/10] flex-shrink-0 rounded-md overflow-hidden bg-slate-200 border border-slate-900">
                    <img
                        src={imgError ? "/placeholder.png" : product.thumbnail}
                        alt=""
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex flex-1 min-w-0 flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="text-base font-bold text-slate-900 leading-snug">
                            {TruncateText(product.productName, 60)}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 leading-relaxed hidden sm:block">
                            {TruncateText(product.description, 90)}
                        </p>
                        <p className="mt-2 label-mono text-slate-500">Qty 1 · Steam key</p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                        <div className="font-mono tabular-nums text-right">
                            {product.specialPrice && product.specialPrice < product.price && (
                                <span className="block text-xs text-slate-500 line-through">${product.price.toFixed(2)}</span>
                            )}
                            <span className="text-lg font-semibold text-slate-900">${Number(unitPrice).toFixed(2)}</span>
                        </div>
                        <button
                            onClick={() => setOpen(true)}
                            aria-label={`Remove ${product.productName} from cart`}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors"
                        >
                            <TrashIcon /> Remove
                        </button>
                    </div>
                </div>
            </motion.li>

            <ConfirmModal
                isOpen={open}
                message={`Remove "${TruncateText(product.productName, 30)}" from cart?`}
                onConfirm={handleRemove}
                onCancel={() => setOpen(false)}
            />
        </>
    );
};
