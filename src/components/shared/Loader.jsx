export const Loader = ({ text = "Loading" }) => (
    <div className="flex flex-col justify-center items-center h-[420px] gap-4" role="status" aria-live="polite">
        <div className="flex gap-1.5" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
                <span
                    key={i}
                    className="w-3 h-8 rounded-sm border border-slate-900 animate-bounce"
                    style={{ animationDelay: `${i * 120}ms`, background: ["var(--color-blue-600)", "var(--color-mustard)", "var(--color-cobalt)", "var(--color-moss)"][i] }}
                />
            ))}
        </div>
        <p className="label-mono text-slate-500">{text}…</p>
    </div>
);
