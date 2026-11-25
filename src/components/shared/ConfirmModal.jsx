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
                style={{ background: "rgba(24,22,18,0.6)" }}
                role="dialog" aria-modal="true" aria-labelledby="confirm-title"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white rounded-lg border border-slate-900 w-full max-w-sm p-6"
                    style={{ boxShadow: "6px 6px 0 0 var(--color-slate-900)" }}
                >
                    {/* Icon */}
                    <div className="w-11 h-11 rounded-md bg-blue-50 border border-slate-900 flex items-center justify-center text-blue-700 mb-5">
                        <AlertIcon />
                    </div>
 
                    <h2 id="confirm-title" className="text-xl font-extrabold text-slate-900 mb-2">
                        Are you sure?
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        {message}
                    </p>
 
                    <div className="flex gap-3">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={onCancel}
                            autoFocus className="flex-1 h-11 rounded-md border border-slate-900 bg-white hover:bg-slate-100 text-sm font-bold text-slate-900 transition-colors duration-150"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={onConfirm}
                            className="flex-1 h-11 rounded-md border border-slate-900 bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors duration-150"
                        >
                            Confirm
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);