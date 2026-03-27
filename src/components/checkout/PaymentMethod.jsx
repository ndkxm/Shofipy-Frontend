import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { saveSelectedPaymentMethod } from "../../store/actions";

// ── Icons ──────────────────────────────────────────────────────────────────────

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

const ChevronIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const QrIcon = () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d1aec8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3" />
    </svg>
);

// ── Helpers ────────────────────────────────────────────────────────────────────

const fieldBase =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-150 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const FieldLabel = ({ children, required }) => (
    <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide uppercase">
        {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
);

// ── Stripe Form ────────────────────────────────────────────────────────────────

const StripeForm = () => {
    const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

    const fmtNumber = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    const fmtExpiry = (v) => {
        const d = v.replace(/\D/g, "").slice(0, 4);
        return d.length > 2 ? d.slice(0, 2) + " / " + d.slice(2) : d;
    };
    const set = (field, fmt) => (e) =>
        setCard((p) => ({ ...p, [field]: fmt ? fmt(e.target.value) : e.target.value }));

    const raw = card.number.replace(/\s/g, "");
    const cardType = raw.startsWith("4") ? "VISA" : /^5[1-5]/.test(raw) ? "MC" : null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
        >
            <div className="mt-4 space-y-3">
                {/* Stripe badge */}
                <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#635BFF]/8 border border-[#635BFF]/20">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="#635BFF">
                            <path d="M6 0C2.69 0 0 2.69 0 6s2.69 6 6 6 6-2.69 6-6S9.31 0 6 0zm-.5 4.5c0-.28.22-.5.5-.5s.5.22.5.5v.25c.55.1 1 .54 1 1.12 0 .37-.18.7-.47.93l-.53.38v.32h-1V7l.77-.55c.1-.07.23-.2.23-.38 0-.28-.22-.5-.5-.5s-.5.22-.5.5H5c0-.58.45-1.02 1-1.12V4.5zm.5 4a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />
                        </svg>
                        <span className="text-xs font-semibold text-[#635BFF]">Powered by Stripe</span>
                    </div>
                </div>

                {/* Card preview */}
                <div
                    className="relative rounded-2xl p-4 overflow-hidden select-none"
                    style={{ background: "linear-gradient(135deg, #635BFF 0%, #7c73ff 50%, #a5a0ff 100%)" }}
                >
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "radial-gradient(circle at 75% 15%, white 0%, transparent 55%)" }} />
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-purple-200 text-xs tracking-widest font-medium uppercase">Card Number</span>
                        {cardType && (
                            <span className="text-white text-xs font-bold tracking-widest bg-white/20 rounded-md px-2 py-0.5">
                                {cardType}
                            </span>
                        )}
                    </div>
                    <p className="text-white font-mono text-sm tracking-widest mb-4">
                        {card.number || "•••• •••• •••• ••••"}
                    </p>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-purple-200 text-xs uppercase tracking-widest mb-0.5">Holder</p>
                            <p className="text-white text-sm font-semibold">{card.name || "YOUR NAME"}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-purple-200 text-xs uppercase tracking-widest mb-0.5">Expires</p>
                            <p className="text-white text-sm font-semibold">{card.expiry || "MM / YY"}</p>
                        </div>
                    </div>
                </div>

                {/* Fields */}
                <div>
                    <FieldLabel required>Card Number</FieldLabel>
                    <input className={fieldBase} placeholder="1234 5678 9012 3456" maxLength={19}
                        value={card.number} onChange={set("number", fmtNumber)} />
                </div>
                <div>
                    <FieldLabel required>Cardholder Name</FieldLabel>
                    <input className={fieldBase} placeholder="John Doe"
                        value={card.name} onChange={set("name")} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <FieldLabel required>Expiry</FieldLabel>
                        <input className={fieldBase} placeholder="MM / YY" maxLength={7}
                            value={card.expiry} onChange={set("expiry", fmtExpiry)} />
                    </div>
                    <div>
                        <FieldLabel required>CVV</FieldLabel>
                        <input className={fieldBase} placeholder="•••" type="password" maxLength={4}
                            value={card.cvv} onChange={set("cvv")} />
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-0.5">
                    <LockIcon />
                    <span>256-bit SSL encrypted · secured by Stripe</span>
                </div>
            </div>
        </motion.div>
    );
};

// ── MoMo Form ──────────────────────────────────────────────────────────────────

const MomoForm = () => (
    <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
    >
        <div className="mt-4 space-y-3">
            {/* QR */}
            <div className="rounded-2xl border border-pink-100 bg-pink-50 p-5 flex flex-col items-center gap-3">
                <div className="w-28 h-28 rounded-xl bg-white border border-pink-200 flex items-center justify-center shadow-sm">
                    <QrIcon />
                </div>
                <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700">Scan to pay with MoMo</p>
                    <p className="text-xs text-slate-400 mt-0.5">Open MoMo app → Scan QR → Confirm</p>
                </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs text-slate-400 font-medium">or enter phone number</span>
                <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Phone */}
            <div>
                <FieldLabel>MoMo Phone Number</FieldLabel>
                <div className="flex gap-2">
                    <div className="flex items-center px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500 whitespace-nowrap select-none">
                        🇻🇳 +84
                    </div>
                    <input className={`${fieldBase} flex-1`} placeholder="912 345 678" type="tel" />
                </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <LockIcon />
                <span>Secured by MoMo payment gateway</span>
            </div>
        </div>
    </motion.div>
);

// ── Methods config ─────────────────────────────────────────────────────────────

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
        form: StripeForm,
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
        form: MomoForm,
    },
];

// ── Main ───────────────────────────────────────────────────────────────────────

export const PaymentMethod = ({ onSelect, onConfirm }) => {
    const [selectedId, setSelectedId] = useState(null);
    const dispatch = useDispatch();

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
                    const Form = method.form;

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

                                {/* Chevron */}
                                <motion.span
                                    animate={{ rotate: isSelected ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-slate-300 flex-shrink-0"
                                >
                                    <ChevronIcon />
                                </motion.span>
                            </div>

                            {/* Expandable form */}
                            <AnimatePresence>
                                {isSelected && (
                                    <div className="px-4 pb-4" onClick={(e) => e.stopPropagation()}>
                                        <div className="border-t border-slate-100 pt-1">
                                            <Form />
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>
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