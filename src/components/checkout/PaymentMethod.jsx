import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { saveSelectedPaymentMethod } from "../../store/actions";


const StripeIcon = () => (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="6" fill="#635BFF" />
        <path
            d="M13.02 11.17c0-.72.59-1 1.56-1 1.39 0 3.15.42 4.54 1.17V7.56A12.06 12.06 0 0 0 14.58 7C11.2 7 9 8.72 9 11.36c0 4.09 5.63 3.43 5.63 5.19 0 .85-.74 1.13-1.77 1.13-1.53 0-3.48-.63-5.02-1.48v3.82c1.71.74 3.43 1.04 5.02 1.04 3.46 0 5.84-1.68 5.84-4.36-.02-4.41-5.68-3.63-5.68-5.53z"
            fill="white"
        />
    </svg>
);

const MomoIcon = () => (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="6" fill="#AE2070" />
        <text x="14" y="19" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">M</text>
    </svg>
);

const CheckIcon = ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const LockIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const METHODS = [
    {
        id: "stripe",
        label: "Stripe",
        description: "Pay securely with credit or debit card",
        icon: StripeIcon,
        accent: "#635BFF",
        accentBg: "bg-[#635BFF]/5",
        accentIconBg: "bg-[#635BFF]/10",
        accentText: "text-[#635BFF]",
        badge: "Recommended",
        badgeClass: "bg-[#635BFF]/8 text-[#635BFF] border border-[#635BFF]/20",
    },
    {
        id: "momo",
        label: "MoMo Wallet",
        description: "Pay via MoMo e-wallet",
        icon: MomoIcon,
        accent: "#AE2070",
        accentBg: "bg-pink-50",
        accentIconBg: "bg-pink-100",
        accentText: "text-pink-600",
        badge: "Popular in VN",
        badgeClass: "bg-pink-50 text-pink-600 border border-pink-200",
    },
];


export const PaymentMethod = ({ onSelect, onConfirm }) => {
    const [selectedId, setSelectedId] = useState(null);
    const dispatch = useDispatch();
    const { paymentMethod } = useSelector((state) => state.payment);

    useEffect(() => {
        setSelectedId(paymentMethod || null);
    }, [paymentMethod]);

    const handleSelect = (method) => {
        setSelectedId(method.id);
        if (onSelect) onSelect(method);
        dispatch(saveSelectedPaymentMethod(method));
    };

    const selected = METHODS.find((m) => m.id === selectedId);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:ital,wght@0,200..900;1,200..900&display=swap');
                .pm-wrap * { font-family: 'Reddit Sans', sans-serif; }
                .pm-row { transition: box-shadow 0.2s ease, border-color 0.2s ease; }
            `}</style>

            <div className="pm-wrap w-full mt-4 space-y-2.5">
                {METHODS.map((method, i) => {
                    const isSelected = selectedId === method.id;
                    const Icon = method.icon;

                    return (
                        <motion.div
                            key={method.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                            onClick={() => handleSelect(method)}
                            className={`pm-row rounded-2xl border cursor-pointer overflow-hidden transition-all duration-200
                                ${isSelected ? `border-slate-300 ${method.accentBg}` : "border-slate-200 bg-white hover:border-slate-300"}`}
                            style={isSelected ? { boxShadow: `0 0 0 2px ${method.accent}33, 0 4px 16px ${method.accent}14` } : {}}
                        >
                            {/* Row header */}
                            <div className="px-4 py-3.5 flex items-center gap-3.5">
                                {/* Custom radio */}
                                <div
                                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                                    style={isSelected
                                        ? { background: method.accent, borderColor: method.accent }
                                        : { background: "white", borderColor: "#cbd5e1" }
                                    }
                                >
                                    {isSelected && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                            className="text-white"
                                        >
                                            <CheckIcon size={10} />
                                        </motion.span>
                                    )}
                                </div>

                                {/* Icon */}
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                                    ${isSelected ? method.accentIconBg : "bg-slate-100"}`}>
                                    <Icon />
                                </div>

                                {/* Label */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-bold text-slate-800">{method.label}</span>
                                        {method.badge && (
                                            <span className={`text-xs font-semibold rounded-lg px-2 py-0.5 ${method.badgeClass}`}>
                                                {method.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5">{method.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Summary bar */}
                <AnimatePresence>
                    {selected && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.25 }}
                            className="mt-1 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 bg-blue-50 border border-blue-200"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center flex-shrink-0">
                                    <LockIcon />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium mb-0.5">Paying with</p>
                                    <p className="text-sm font-semibold text-slate-700">{selected.label}</p>
                                </div>
                            </div>
                            {onConfirm && (
                                <button
                                    onClick={onConfirm}
                                    className="flex-shrink-0 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-all duration-150"
                                    style={{ boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}
                                >
                                    Confirm
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};
