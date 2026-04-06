import React from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserCart } from "../../store/actions";

// ── Icons ──────────────────────────────────────────────────────────────────────

const MapPinIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const PackageIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

const ReceiptIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" />
        <line x1="8" y1="9" x2="16" y2="9" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
);

const CreditCardIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

const StripeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="6" fill="#635BFF" />
        <path d="M13.02 11.17c0-.72.59-1 1.56-1 1.39 0 3.15.42 4.54 1.17V7.56A12.06 12.06 0 0 0 14.58 7C11.2 7 9 8.72 9 11.36c0 4.09 5.63 3.43 5.63 5.19 0 .85-.74 1.13-1.77 1.13-1.53 0-3.48-.63-5.02-1.48v3.82c1.71.74 3.43 1.04 5.02 1.04 3.46 0 5.84-1.68 5.84-4.36-.02-4.41-5.68-3.63-5.68-5.53z" fill="white" />
    </svg>
);

const MomoIcon = () => (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="6" fill="#AE2070" />
        <text x="14" y="19" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">M</text>
    </svg>
);

const CheckCircleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const ImageFallbackIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);

// ── Constants ──────────────────────────────────────────────────────────────────

const SHIPPING_FEE = 5.00;
const DISCOUNT = 2.50;

// ── Helpers ────────────────────────────────────────────────────────────────────

const fmt = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

// ── Shared UI ──────────────────────────────────────────────────────────────────

const SectionTitle = ({ icon, children }) => (
    <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
            {icon}
        </div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{children}</span>
    </div>
);

const Card = ({ children, className = "" }) => (
    <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${className}`}>
        {children}
    </div>
);

const Divider = () => <div className="h-px bg-slate-100 my-3" />;

// ── Item Image (Cloudinary) ────────────────────────────────────────────────────

const ItemImage = ({ src, alt }) => {
    const [error, setError] = React.useState(false);

    if (!src || error) {
        return (
            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                <ImageFallbackIcon />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            onError={() => setError(true)}
            className="w-11 h-11 rounded-xl object-cover border border-slate-100 flex-shrink-0"
        />
    );
};

// ── Sub-components ─────────────────────────────────────────────────────────────

const AddressSection = ({ address }) => (
    <Card>
        <SectionTitle icon={<MapPinIcon />}>Delivery Address</SectionTitle>
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800">{address.fullName}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-sm text-slate-500">{address.phoneNumber}</span>
            </div>
            <p className="text-sm text-slate-600">{address.street}</p>
            <p className="text-sm text-slate-600">{address.city}</p>
        </div>
    </Card>
);

const OrderItemsSection = ({ cart }) => (
    <Card>
        <SectionTitle icon={<PackageIcon />}>Order Items</SectionTitle>
        <div className="space-y-3">
            {cart.map((item, i) => (
                <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                    {i > 0 && <Divider />}
                    <div className="flex items-start gap-3">
                        <ItemImage src={item.image} alt={item.productName} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 leading-snug">{item.productName}</p>
                            {item.quantity > 1 && (
                                <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                            )}
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-slate-800">{fmt(item.specialPrice * item.quantity)}</p>
                            {item.quantity > 1 && (
                                <p className="text-xs text-slate-400 mt-0.5">{fmt(item.specialPrice)} × {item.quantity}</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    </Card>
);

const SummarySection = ({ subtotal, total }) => {
    const rows = [
        { label: "Subtotal", value: fmt(subtotal) },
        { label: "Shipping", value: fmt(SHIPPING_FEE) },
        { label: "Discount", value: `−${fmt(DISCOUNT)}`, color: "text-green-600" },
    ];

    return (
        <Card>
            <SectionTitle icon={<ReceiptIcon />}>Summary</SectionTitle>
            <div className="space-y-2">
                {rows.map((r) => (
                    <div key={r.label} className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">{r.label}</span>
                        <span className={`text-sm font-semibold ${r.color || "text-slate-600"}`}>{r.value}</span>
                    </div>
                ))}
            </div>
            <Divider />
            <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800">Total</span>
                <span className="text-lg font-bold text-slate-900">{fmt(total)}</span>
            </div>
        </Card>
    );
};

const PaymentMethodSection = ({ payment }) => {
    const isStripe = payment === "Stripe";

    return (
        <Card>
            <SectionTitle icon={<CreditCardIcon />}>Payment Method</SectionTitle>
            <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isStripe ? "bg-[#635BFF]/10" : "bg-pink-100"}`}>
                    {isStripe ? <StripeIcon /> : <MomoIcon />}
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-slate-800">{payment}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-green-500"><CheckCircleIcon /></span>
                    <span className="text-xs font-semibold text-green-600">Verified</span>
                </div>
            </div>
        </Card>
    );
};

// ── Main ───────────────────────────────────────────────────────────────────────

export const OrderSummary = ({ onPlaceOrder }) => {
    const dispatch = useDispatch();
    dispatch(fetchUserCart());

    const { selectedCheckoutAddress } = useSelector((state) => state.auth);
    const { paymentMethod } = useSelector((state) => state.payment);
    const { cart } = useSelector((state) => state.carts);

    const subtotal = cart.reduce((acc, i) => acc + i.specialPrice * i.quantity, 0);
    const total = subtotal + SHIPPING_FEE - DISCOUNT;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:ital,wght@0,200..900;1,200..900&display=swap');
                .os-wrap * { font-family: 'Reddit Sans', sans-serif; }
            `}</style>

            <div className="os-wrap w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* Left column */}
                    <div className="space-y-4">
                        <AddressSection address={selectedCheckoutAddress} />
                        <OrderItemsSection cart={cart} />
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                        <SummarySection subtotal={subtotal} total={total} />
                        <PaymentMethodSection payment={paymentMethod} />

                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={onPlaceOrder}
                            className="w-full py-3.5 rounded-2xl text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 transition-all duration-150"
                            style={{ boxShadow: "0 4px 16px rgba(59,130,246,0.35)" }}
                        >
                            Place Order · {fmt(total)}
                        </motion.button>

                        <p className="text-center text-xs text-slate-400">
                            By placing this order you agree to our Terms &amp; Conditions
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};