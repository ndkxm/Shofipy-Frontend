import { motion, AnimatePresence } from "framer-motion";
export const InputField = ({
    label, id, type, errors, register,
    required, message, className, min, value, placeholder
}) => {
    const hasError = !!errors[id]?.message;

    return (
        <div className="flex flex-col gap-1.5 w-full" style={{ fontFamily: "'Reddit Sans', sans-serif" }}>
            <label
                htmlFor={id}
                className="text-xs font-bold text-slate-500 uppercase tracking-wider"
            >
                {label}
                {required && <span className="text-red-400 ml-0.5">*</span>}
            </label>

            <input
                type={type}
                id={id}
                placeholder={placeholder}
                className={`
                    w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800
                    placeholder-slate-400 outline-none bg-white
                    transition-all duration-150
                    ${hasError
                        ? "border-red-400 ring-2 ring-red-100"
                        : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    }
                    ${className || ""}
                `}
                style={{ fontFamily: "'Reddit Sans', sans-serif" }}
                {...register(id, {
                    required: { value: required, message },
                    minLength: min ? { value: min, message: `Minimum ${min} characters required` } : null,
                    pattern:
                        type === "email" ? {
                            value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                            message: "Invalid email address",
                        } : type === "url" ? {
                            value: /^(https?:\/\/)?(www\.)?[A-Za-z0-9-]+\.[A-Za-z]{2,}(:\d+)?(\/\S*)?$/,
                            message: "Invalid URL",
                        } : null,
                })}
            />

            {hasError && (
                <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-xs font-semibold text-red-500 flex items-center gap-1"
                    style={{ fontFamily: "'Reddit Sans', sans-serif" }}
                >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors[id]?.message}
                </motion.p>
            )}
        </div>
    );
};