import { motion, AnimatePresence } from "framer-motion";
 
// ─────────────────────────────────────────────────────────────────────────────
// ConfirmModal
// ─────────────────────────────────────────────────────────────────────────────
 
const AlertIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);
 
export const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 flex items-center justify-center z-50 px-4"
                style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(2px)" }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white rounded-3xl border border-slate-200 w-full max-w-sm p-6"
                    style={{ fontFamily: "'Reddit Sans', sans-serif", boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }}
                >
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mb-4">
                        <AlertIcon />
                    </div>
 
                    <h2 className="text-base font-extrabold text-slate-900 mb-2 tracking-tight">
                        Confirm Action
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                        {message}
                    </p>
 
                    <div className="flex gap-3">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={onCancel}
                            className="flex-1 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-600 transition-colors duration-150"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={onConfirm}
                            className="flex-1 py-2.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors duration-150"
                            style={{ boxShadow: "0 3px 10px rgba(239,68,68,0.3)" }}
                        >
                            Confirm
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);