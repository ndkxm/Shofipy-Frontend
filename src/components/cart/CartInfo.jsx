import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ArrowRightIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

export const CheckOut = ({ summary }) => {
    const rows = [
        { label: "Subtotal", value: `$${summary.subtotal.toFixed(2)}`, color: "text-slate-600" },
        { label: "Shipping", value: summary.shipping === 0 ? "Free" : `$${summary.shipping.toFixed(2)}`, color: summary.shipping === 0 ? "text-green-600" : "text-slate-600" },
        { label: "Discount", value: summary.discount > 0 ? `−$${summary.discount.toFixed(2)}` : "—", color: summary.discount > 0 ? "text-rose-500" : "text-slate-400" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-24"
            style={{ fontFamily: "'Reddit Sans', sans-serif", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
        >
            {/* Title */}
            <h2 className="text-base font-extrabold text-slate-900 mb-5 tracking-tight">
                Order Summary
            </h2>

            {/* Rows */}
            <div className="space-y-3 mb-4">
                {rows.map((row) => (
                    <div key={row.label} className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">{row.label}</span>
                        <span className={`text-sm font-semibold ${row.color}`}>{row.value}</span>
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 my-4" />

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-slate-800">Total</span>
                <span className="text-xl font-extrabold text-slate-900">${summary.total.toFixed(2)}</span>
            </div>

            {/* Checkout button */}
            <Link to="/checkout">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors duration-150"
                    style={{ boxShadow: "0 4px 14px rgba(59,130,246,0.32)" }}
                >
                    Proceed to Checkout
                    <ArrowRightIcon />
                </motion.button>
            </Link>

            {/* Continue shopping */}
            <Link to="/products">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-3 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-600 transition-colors duration-150"
                >
                    Continue Shopping
                </motion.button>
            </Link>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-slate-400">
                <ShieldIcon />
                <span>Secure checkout · SSL encrypted</span>
            </div>
        </motion.div>
    );
};