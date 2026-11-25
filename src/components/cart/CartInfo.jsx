import { Link } from "react-router-dom";

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
        { label: "Subtotal", value: `$${summary.subtotal.toFixed(2)}` },
        { label: "Delivery", value: "Instant · free" },
        { label: "Discount", value: summary.discount > 0 ? `−$${summary.discount.toFixed(2)}` : "—" },
    ];

    return (
        <aside
            className="lg:sticky lg:top-24 bg-white border border-slate-900 rounded-lg overflow-hidden"
            style={{ boxShadow: "5px 5px 0 0 var(--color-slate-900)" }}
        >
            <h2 className="px-5 py-3 bg-slate-900 text-slate-50 label-mono">Order summary</h2>

            <dl className="p-5 space-y-3 text-sm">
                {rows.map((row) => (
                    <div key={row.label} className="flex justify-between">
                        <dt className="text-slate-600">{row.label}</dt>
                        <dd className="font-mono tabular-nums text-slate-900">{row.value}</dd>
                    </div>
                ))}
                <div className="flex justify-between items-baseline pt-4 mt-1 border-t border-dashed border-slate-400">
                    <dt className="font-bold text-slate-900">Total</dt>
                    <dd className="font-mono tabular-nums text-3xl font-semibold text-slate-900">${summary.total.toFixed(2)}</dd>
                </div>
            </dl>

            <div className="px-5 pb-5 space-y-3">
                <Link to="/checkout" className="btn-accent w-full !py-3.5 text-[15px]">
                    Checkout <ArrowRightIcon />
                </Link>
                <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                    <ShieldIcon /> Payments handled by Stripe
                </p>
            </div>
        </aside>
    );
};
